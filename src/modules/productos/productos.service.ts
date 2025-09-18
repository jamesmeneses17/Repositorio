import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) { }

    async create(dto: CreateProductoDto): Promise<Producto> {
        const categoria = await this.categoriaRepository.findOneBy({ id: dto.categoriaId });
        if (!categoria) {
            throw new BadRequestException(`La categoría con ID ${dto.categoriaId} no existe`);
        }

        const producto = this.productoRepository.create({
            ...dto,
            categoria,
        });

        return await this.productoRepository.save(producto);
    }

    async findAll(): Promise<Producto[]> {
        return await this.productoRepository.find();
    }

    async findOne(id: number): Promise<Producto> {
        const producto = await this.productoRepository.findOne({ where: { id } });
        if (!producto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return producto;
    }

    async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
        const producto = await this.findOne(id);

        if (dto.categoriaId) {
            const categoria = await this.categoriaRepository.findOneBy({ id: dto.categoriaId });
            if (!categoria) {
                throw new BadRequestException(`La categoría con ID ${dto.categoriaId} no existe`);
            }
            producto.categoria = categoria;
        }

        Object.assign(producto, dto);
        return await this.productoRepository.save(producto);
    }

    async remove(id: number): Promise<void> {
        const producto = await this.findOne(id);
        await this.productoRepository.remove(producto);
    }
    async aumentarStock(id: number, cantidad: number) {
        const producto = await this.productoRepository.findOne({ where: { id } });
        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }
        producto.stock += cantidad;
        return this.productoRepository.save(producto);
    }

    async disminuirStock(id: number, cantidad: number) {
        const producto = await this.productoRepository.findOne({ where: { id } });
        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }
        if (producto.stock - cantidad < 0) {
            throw new BadRequestException('No hay suficiente stock');
        }
        producto.stock -= cantidad;
        return this.productoRepository.save(producto);
    }



}
