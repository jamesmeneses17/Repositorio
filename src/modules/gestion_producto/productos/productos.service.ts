import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(Producto)
        private readonly productosRepo: Repository<Producto>,
    ) { }

    async create(dto: CreateProductoDto): Promise<Producto> {
        const dataToSave = {
            ...dto,
            estadoId: dto.estadoId || 1,
        };
        const producto = this.productosRepo.create(dataToSave);
        return this.productosRepo.save(producto);
    }

    async getProductosFiltrados(subcategoriaId?: number, categoriaId?: number): Promise<Producto[]> {
        const queryBuilder = this.productosRepo.createQueryBuilder('producto')
            .leftJoinAndSelect('producto.precios', 'precio')
            .leftJoinAndSelect('producto.inventario', 'inventario')
            .innerJoin('producto.caracteristicas', 'caracteristica')
            .where('producto.estadoId = :estado', { estado: 1 }); // Solo productos activos

        if (subcategoriaId) {
            queryBuilder.andWhere('caracteristica.subcategoria = :subcategoriaId', { subcategoriaId });
        } else if (categoriaId) {
            queryBuilder
                .innerJoin('caracteristica.subcategoria', 'subcategoria')
                .andWhere('subcategoria.categoria = :categoriaId', { categoriaId });
        }

        // Elimina duplicados si hay varios matches
        // queryBuilder.distinct(true); // Si usas Postgres, si no, omite

        return queryBuilder.getMany();
    }

    async findAll(): Promise<Producto[]> {
        return this.getProductosFiltrados();
    }

    async findOne(id: number): Promise<Producto> {
        const producto = await this.productosRepo.findOne({
            where: { id },
        });
        if (!producto) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }
        return producto;
    }

    async findOneWithRelations(id: number): Promise<Producto> {
        const producto = await this.productosRepo.findOne({
            where: { id },
            relations: ['caracteristicas', 'precios', 'inventario'],
        });
        if (!producto) {
            throw new NotFoundException(`Producto with ID ${id} not found`);
        }
        return producto;
    }

    async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
        const producto = await this.findOne(id);
        Object.assign(producto, dto);
        return this.productosRepo.save(producto);
    }

    async remove(id: number): Promise<void> {
        const producto = await this.findOne(id);
        await this.productosRepo.remove(producto);
    }
}