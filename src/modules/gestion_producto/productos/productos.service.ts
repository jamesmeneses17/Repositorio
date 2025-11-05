// productos.service.ts

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
        // Crear producto
        const producto = this.productosRepo.create(dataToSave);
        const savedProducto = await this.productosRepo.save(producto);

        // Si se envía stock o ubicacion, crear inventario
        if (dto.stock !== undefined || dto.ubicacion !== undefined) {
            const inventarioRepo = this.productosRepo.manager.getRepository('Inventario');
            await inventarioRepo.save({
                producto: savedProducto,
                stock: dto.stock ?? 0,
                ubicacion: dto.ubicacion ?? null,
            });
        }
        return savedProducto;
    }

    async getAllProductos(): Promise<Producto[]> {
        return this.productosRepo.find({
            relations: [
                'estado',
                'precios',
                'inventario',
                'categoria', // 👈 Relación directa a Categoria
            ],
        });
    }

    // Mantiene la lógica original de filtrado
    async getProductosConFiltro(subcategoriaId?: number, categoriaId?: number): Promise<Producto[]> {
        const queryBuilder = this.productosRepo.createQueryBuilder('producto')
            .leftJoinAndSelect('producto.precios', 'precio')
            .leftJoinAndSelect('producto.inventario', 'inventario')
            .leftJoinAndSelect('producto.estado', 'estado');

        if (subcategoriaId || categoriaId) {
            queryBuilder.innerJoin(
                'producto_caracteristicas',
                'caracteristica',
                'caracteristica.producto_id = producto.id'
            );
        }

        if (subcategoriaId) {
            queryBuilder.andWhere('caracteristica.subcategoria_id = :subcategoriaId', { subcategoriaId });
        } else if (categoriaId) {
            queryBuilder.innerJoin(
                'subcategorias',
                'subcategoria',
                'subcategoria.id = caracteristica.subcategoria_id'
            );
            queryBuilder.andWhere('subcategoria.categoria_id = :categoriaId', { categoriaId });
        }

        return queryBuilder.getMany();
    }

    async findOneById(id: number): Promise<Producto> {
        const producto = await this.productosRepo.findOne({
            where: { id },
            // ✅ CLAVE: Aseguramos que las FKs se carguen para el preload si es necesario.
            relations: ['estado', 'categoria'],
        });
        if (!producto) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }
        return producto;
    }

    // ✅ CAMBIO CLAVE: Agregamos 'categoria' a las relaciones
    async findOneWithRelations(id: number): Promise<Producto> {
        const producto = await this.productosRepo.findOne({
            where: { id },
            // Agregamos 'categoria' aquí para que el frontend obtenga categoriaId
            relations: ['caracteristicas', 'precios', 'inventario', 'estado', 'categoria'],
        });
        if (!producto) {
            throw new NotFoundException(`Producto with ID ${id} not found`);
        }
        return producto;
    }


    // Este método está bien para PUT o PATCH
    async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
        // 1. Usamos el método preload para fusionar los datos del DTO con el producto existente.
        //    Esto maneja correctamente la asignación de FKs (categoriaId, estadoId).
        const productoPreloaded = await this.productosRepo.preload({
            id: id,
            ...dto,
        });

        // 2. Comprobamos si el producto existe después de la carga
        if (!productoPreloaded) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado para actualizar.`);
        }

        // 3. Guardamos la entidad fusionada en la base de datos
        const updatedProducto = await this.productosRepo.save(productoPreloaded);

        // 4. Actualizar inventario si se envía stock o ubicacion
        if (dto.stock !== undefined || dto.ubicacion !== undefined) {
            const inventarioRepo = this.productosRepo.manager.getRepository('Inventario');
            let inventario = await inventarioRepo.findOne({ where: { producto: { id } } });
            if (!inventario) {
                inventario = inventarioRepo.create({ producto: updatedProducto });
            }
            inventario.stock = dto.stock ?? inventario.stock;
            inventario.ubicacion = dto.ubicacion ?? inventario.ubicacion;
            await inventarioRepo.save(inventario);
        }
        return updatedProducto;
    }

    async remove(id: number): Promise<void> {
        const producto = await this.findOneById(id);
        await this.productosRepo.remove(producto);
    }
}