import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly repo: Repository<Inventario>,
  ) {}

  create(dto: CreateInventarioDto) {
    const nuevo = this.repo.create({
      producto: { id: dto.producto_id } as any,
      stock: dto.stock,
      ubicacion: dto.ubicacion,
    });
    return this.repo.save(nuevo);
  }

  findAll() {
    return this.repo.find({ relations: ['producto'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['producto'] });
  }

  async update(id: number, dto: UpdateInventarioDto) {
    await this.repo.update(id, {
      producto: dto.producto_id ? ({ id: dto.producto_id } as any) : undefined,
      stock: dto.stock,
      ubicacion: dto.ubicacion,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`Inventario with id ${id} not found`);
    }
    return this.repo.remove(entity);
  }
}
