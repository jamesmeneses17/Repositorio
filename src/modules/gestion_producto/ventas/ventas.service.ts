// src/ventas/ventas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/CreateVentaDto';
import { UpdateVentaDto } from './dto/UpdateVentaDto';
@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  // Crear una nueva venta
  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const nuevaVenta = this.ventaRepository.create(createVentaDto);
    return this.ventaRepository.save(nuevaVenta);
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