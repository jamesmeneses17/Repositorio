// productos/productos.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

// 🔑 IMPORTAR SERVICIOS RELACIONADOS
import { InventarioService } from '../inventario/inventario.service'; 
import { PreciosService } from '../precios/precios.service';


@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(Producto)
        private readonly productosRepo: Repository<Producto>,
        // 🔑 INYECCIÓN DE DEPENDENCIAS REQUERIDAS
        private readonly inventarioService: InventarioService,
        private readonly preciosService: PreciosService,
    ) { }

    async create(dto: CreateProductoDto): Promise<Producto> {
        // 1. Separar campos: (stock, ubicacion, precio) vs (productoData)
        const { stock, ubicacion, precio, ...productoData } = dto;
        
        const dataToSave = {
            ...productoData,
            estadoId: productoData.estadoId || 1,
        };
        
        // 2. Crear y Guardar producto principal
        const producto = this.productosRepo.create(dataToSave);
        const savedProducto = await this.productosRepo.save(producto);
        const productoId = savedProducto.id;

        // 3. Crear Inventario (DELEGA LA TAREA)
        if (stock !== undefined || ubicacion !== undefined) {
            // Usamos el mismo método de actualización para el caso de creación inicial
            await this.inventarioService.actualizarInventarioPorProductoId(
                productoId, 
                stock ?? 0, // Pasa 0 si no se define stock
                ubicacion
            );
        }

        // 4. Crear Precio (DELEGA LA TAREA)
        if (precio !== undefined && precio !== null) {
            // Usamos el mismo método de actualización para el caso de creación inicial
            await this.preciosService.actualizarPrecioPorProductoId(productoId, precio);
        }
        
        // 5. Devolver el producto completo con todas las relaciones
        return this.findOneWithRelations(productoId); 
    }

    async getAllProductos(): Promise<Producto[]> {
        return this.productosRepo.find({
            relations: [
                'estado',
                'precios',
                'inventario',
                'categoria',
            ],
        });
    }
    
    // ... (getProductosConFiltro y findOneById se mantienen)

    async findOneWithRelations(id: number): Promise<Producto> {
        const producto = await this.productosRepo.findOne({
            where: { id },
            // Asegúrate de cargar las relaciones para obtener stock y precio
            relations: ['precios', 'inventario', 'estado', 'categoria'],
        });
        if (!producto) {
            throw new NotFoundException(`Producto with ID ${id} not found`);
        }
        
        // 🔑 INYECTAR stock y precio para que el frontend los lea fácilmente
        // Se asume que el stock es el primer elemento del array (solo debe haber uno)
(producto as any).stock = producto.inventario?.[0]?.stock || 0;        // Se asume que el precio es el primer elemento del array (deberías tener una lógica de 'precio actual')
        (producto as any).precio = producto.precios?.[0]?.valor_unitario || 0; 

        return producto;
    }


    async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
        // 1. Separar campos: (stock, ubicacion, precio) vs (productoData)
        const { stock, ubicacion, precio, ...productoData } = dto;
        
        // 2. Actualizar el registro principal (tabla `productos`)
        const productoPreloaded = await this.productosRepo.preload({
            id: id,
            ...productoData,
        });

        if (!productoPreloaded) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado para actualizar.`);
        }

        // 3. Guardar la entidad fusionada en la tabla `productos`
        await this.productosRepo.save(productoPreloaded);

        // --- 4. DELEGAR ACTUALIZACIÓN DE INVENTARIO ---
                if (stock !== undefined || ubicacion !== undefined) {
                        // Solo pasar valores definidos, nunca undefined
                        await this.inventarioService.actualizarInventarioPorProductoId(
                                id,
                                stock ?? 0,
                                ubicacion ?? undefined
                        );
                }
        
        // --- 5. DELEGAR ACTUALIZACIÓN DE PRECIOS ---
        if (precio !== undefined && precio !== null) {
            // Llama al método recién creado en PreciosService
            await this.preciosService.actualizarPrecioPorProductoId(id, precio);
        }
        
        // 6. Devolver el producto completo con todas las relaciones cargadas
        return this.findOneWithRelations(id); 
    }

    async remove(id: number): Promise<void> {
        const producto = await this.findOneWithRelations(id);
        await this.productosRepo.remove(producto);
    }
}