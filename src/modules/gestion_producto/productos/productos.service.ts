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

    /**
     * Devuelve TODOS los productos con sus relaciones clave cargadas.
     * Este es el método usado por GET /productos en el controlador.
     */
 // En productos.service.ts
async getAllProductos(): Promise<Producto[]> {
        return this.productosRepo.find({
            relations: [
                'estado', 
                'precios', 
                'inventario',
                'categoria', // 👈 ¡Relación directa a Categoria!
            ], 
        });
    }
    
    // --------------------------------------------------------------------------------
    // MÉTODOS DE FILTRADO Y DETALLE (Se mantienen para uso interno o futuro)
    // --------------------------------------------------------------------------------

    // Mantiene la lógica original de filtrado por subcategoría/categoría
    async getProductosConFiltro(subcategoriaId?: number, categoriaId?: number): Promise<Producto[]> {
        const queryBuilder = this.productosRepo.createQueryBuilder('producto')
            .leftJoinAndSelect('producto.precios', 'precio')
            .leftJoinAndSelect('producto.inventario', 'inventario')
            .leftJoinAndSelect('producto.estado', 'estado');
            
        // Si se filtra por subcategoría o categoría, une explícitamente la tabla producto_caracteristicas
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
            relations: ['estado'], // Relación base para edición y eliminación
        });
        if (!producto) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }
        return producto;
    }

    // Usado para cargar datos completos del producto, por ejemplo, en un formulario de edición
    async findOneWithRelations(id: number): Promise<Producto> {
        const producto = await this.productosRepo.findOne({
            where: { id },
            relations: ['caracteristicas', 'precios', 'inventario', 'estado'], 
        });
        if (!producto) {
            throw new NotFoundException(`Producto with ID ${id} not found`);
        }
        return producto;
    }


    async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
        const producto = await this.findOneById(id);
        Object.assign(producto, dto);
        return this.productosRepo.save(producto);
    }

    async remove(id: number): Promise<void> {
        const producto = await this.findOneById(id);
        await this.productosRepo.remove(producto);
    }
}