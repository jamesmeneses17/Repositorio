import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

import { Compra } from './entities/compra.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepo: Repository<Compra>,
  ) {}

  // ===== CREAR =====
  async create(dto: CreateCompraDto) {
    const compra = this.compraRepo.create(dto);
    return this.compraRepo.save(compra);
  }

  // ===== LISTAR TODAS =====
  findAll() {
    return this.compraRepo.find({
      relations: ['producto', 'categoria'],
      order: { id: 'DESC' }
    });
  }

  // ===== BUSCAR UNA =====
  async findOne(id: number) {
    const compra = await this.compraRepo.findOne({
      where: { id },
      relations: ['producto', 'categoria'],
    });

    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }

    return compra;
  }

  // ===== ACTUALIZAR =====
  async update(id: number, dto: UpdateCompraDto) {
    const compra = await this.compraRepo.preload({
      id,
      ...dto,
    });

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
