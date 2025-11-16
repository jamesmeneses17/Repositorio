import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

import { Compra } from './entities/compra.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepo: Repository<Compra>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  // ===== CREAR =====
  async create(dto: CreateCompraDto) {
    // Normalizar fecha a YYYY-MM-DD porque la columna es de tipo DATE en MySQL
    const fecha = dto.fecha ? String(dto.fecha).split('T')[0] : null;

    // Mapear producto_id -> productoId (DTO usa snake_case desde front)
    const data: any = {
      ...dto,
      fecha,
    };

    if ((dto as any).producto_id !== undefined) {
      data.productoId = (dto as any).producto_id;
      delete data.producto_id;
    }

    // Si tenemos productoId, obtener su categoriaId y asignarlo (mantener consistencia con la BD)
    if (data.productoId) {
      const producto = await this.productoRepo.findOne({ where: { id: data.productoId } });
      if (!producto) throw new NotFoundException('Producto no encontrado');
      data.categoriaId = producto.categoriaId ?? null;
    }

    const compra = this.compraRepo.create(data);
    return this.compraRepo.save(compra);
  }

  // ===== LISTAR TODAS =====
  findAll() {
    return this.compraRepo.find({
      relations: ['producto'],
      order: { id: 'DESC' }
    });
  }

  // ===== BUSCAR UNA =====
  async findOne(id: number) {
    const compra = await this.compraRepo.findOne({
      where: { id },
      relations: ['producto'],
    });

    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }

    return compra;
  }

  // ===== ACTUALIZAR =====
  async update(id: number, dto: UpdateCompraDto) {
    // Preparar datos antes de preload: normalizar fecha y mapear producto_id
    const data: any = { id, ...dto };

    if ((dto as any).fecha) {
      data.fecha = String((dto as any).fecha).split('T')[0];
    }

    if ((dto as any).producto_id !== undefined) {
      data.productoId = (dto as any).producto_id;
      delete data.producto_id;
      const producto = await this.productoRepo.findOne({ where: { id: data.productoId } });
      if (!producto) throw new NotFoundException('Producto no encontrado');
      data.categoriaId = producto.categoriaId ?? null;
    }

    const compra = await this.compraRepo.preload(data);

    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }

    return this.compraRepo.save(compra);
  }

  // ===== ELIMINAR =====
  async remove(id: number) {
    const compra = await this.findOne(id);
    return this.compraRepo.remove(compra);
  }
}
