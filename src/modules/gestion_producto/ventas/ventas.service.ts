// src/ventas/ventas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/CreateVentaDto';
import { UpdateVentaDto } from './dto/UpdateVentaDto';
import { Producto } from '../productos/entities/producto.entity';
import { Inventario } from '../inventario/entities/inventario.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  // Crear una nueva venta
  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    // Normalizar fecha a YYYY-MM-DD
    const fechaNormalizada = createVentaDto.fecha 
      ? String(createVentaDto.fecha).split('T')[0] 
      : undefined;

    const data = {
      ...createVentaDto,
      fecha: fechaNormalizada,
    };

    const nuevaVenta = this.ventaRepository.create(data);
    const ventaGuardada = await this.ventaRepository.save(nuevaVenta);

    // ===== ACTUALIZAR INVENTARIO =====
    if (createVentaDto.productoId && createVentaDto.cantidad) {
      const producto = await this.productoRepo.findOne({
        where: { id: createVentaDto.productoId },
        relations: ['inventario'],
      });

      if (producto) {
        // Garantizar que existe registro de inventario
        if (!producto.inventario) {
          const nuevoInventario = this.inventarioRepo.create({
            productoId: producto.id,
            stock: 0,
            compras: 0,
            ventas: 0,
          });
          producto.inventario = await this.inventarioRepo.save(nuevoInventario);
        }

        const stockActual = producto.inventario.stock || 0;
        const ventasActuales = producto.inventario.ventas || 0;
        const cantidad = Number(createVentaDto.cantidad);

        // Actualizar inventario: reducir stock y aumentar ventas
        await this.inventarioRepo.update(producto.inventario.id, {
          stock: Math.max(0, stockActual - cantidad),
          ventas: ventasActuales + cantidad,
        });

        console.log(`✅ Inventario actualizado para producto ${producto.id}:`, {
          stockAnterior: stockActual,
          stockNuevo: Math.max(0, stockActual - cantidad),
          ventasNuevas: ventasActuales + cantidad,
        });
      }
    }

    return ventaGuardada;
  }

  // Encontrar todas las ventas
  findAll(): Promise<Venta[]> {
    return this.ventaRepository.find();
  }

  // Encontrar una venta por ID
  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });
    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada.`);
    }
    return venta;
  }

  // Actualizar una venta
  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id); // Reutiliza findOne para verificar existencia
    
    // Aplica los cambios y guarda
    this.ventaRepository.merge(venta, updateVentaDto);
    return this.ventaRepository.save(venta);
  }

  // Eliminar una venta
  async remove(id: number): Promise<void> {
    const result = await this.ventaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada.`);
    }
  }
}