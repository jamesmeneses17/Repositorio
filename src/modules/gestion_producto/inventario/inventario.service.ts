import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
// Importa tus DTOs si los usas en los métodos CRUD (aquí usamos Partial<Inventario> como ejemplo)
// import { CreateInventarioDto } from './dto/create-inventario.dto';
// import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
    constructor(
        @InjectRepository(Inventario)
        private readonly repo: Repository<Inventario>,
    ) {}

    // ================= MÉTODOS CRUD PARA EL CONTROLLER =================
    async create(dto: Partial<Inventario>): Promise<Inventario> {
        const inventario = this.repo.create(dto);
        return this.repo.save(inventario);
    }

    async findAll(): Promise<Inventario[]> {
        return this.repo.find();
    }

    async findOne(id: number): Promise<Inventario> {
        const inventario = await this.repo.findOne({ where: { id } });
        if (!inventario) {
            throw new NotFoundException(`Inventario con id ${id} no encontrado`);
        }
        return inventario;
    }

    async update(id: number, dto: Partial<Inventario>): Promise<Inventario> {
        // Nota: Usar preload es más seguro si manejas relaciones complejas
        const inventario = await this.findOne(id);
        Object.assign(inventario, dto);
        return this.repo.save(inventario);
    }

    async remove(id: number): Promise<void> {
        const inventario = await this.findOne(id);
        await this.repo.remove(inventario);
    }

// =========================================================================
// ✅ MÉTODO REQUERIDO POR PRODUCTOS SERVICE (ACTUALIZADO SIN stockMinimo)
// =========================================================================

    // 🚀 MÉTODO ACTUALIZADO: YA NO ACEPTA NI GUARDA stockMinimo
    async actualizarInventarioPorProductoId(
        productoId: number, 
        stock: number, 
        ubicacion?: string,
        // ❌ PARÁMETRO stockMinimo ELIMINADO
    ): Promise<Inventario> {
        // 1. Buscar el registro existente por productoId
        let inventario = await this.repo.findOne({ 
            where: { producto: { id: productoId } } 
        });

        if (!inventario) {
            // Si no existe, crear registro
            inventario = this.repo.create({
                producto: { id: productoId } as any,
                stock: stock,
                ubicacion: typeof ubicacion === 'string' ? ubicacion : undefined,
                // ❌ CAMPO stock_minimo ELIMINADO DE LA CREACIÓN
            });
        } else {
            // Si existe, actualizar solo los campos que vienen definidos
            if (stock !== undefined && stock !== null) {
                inventario.stock = stock;
            }
            if (ubicacion !== undefined) {
                inventario.ubicacion = ubicacion;
            }
            // ❌ LÓGICA DE ACTUALIZACIÓN DE stockMinimo ELIMINADA
        }

        return this.repo.save(inventario);
    }
}