// subcategorias/subcategorias.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Subcategoria } from './entities/subcategoria.entity';
import type { CreateSubcategoriaDto } from './dtos/create-subcategoria.dto';
import type { UpdateSubcategoriaDto } from './dtos/update-subcategoria.dto';

@Injectable()
export class SubcategoriasService {
  constructor(
    @InjectRepository(Subcategoria)
    private readonly subcategoriaRepo: Repository<Subcategoria>,
  ) {}

  // --- Operaciones CRUD reales usando TypeORM ---

  async create(createDto: CreateSubcategoriaDto): Promise<Subcategoria> {
    const data: DeepPartial<Subcategoria> = {
      nombre: createDto.nombre,
      // mapear snake_case del DTO a camelCase de la entidad
      categoriaId: (createDto as any).categoria_id,
    };

    const nueva = this.subcategoriaRepo.create(data);
    return this.subcategoriaRepo.save(nueva);
  }

  async findAll(): Promise<Subcategoria[]> {
    return this.subcategoriaRepo.find({ relations: ['categoria'] });
  }

  async findOne(id: number): Promise<Subcategoria> {
    const found = await this.subcategoriaRepo.findOne({ where: { id }, relations: ['categoria'] });
    if (!found) throw new NotFoundException(`Subcategoría con ID ${id} no encontrada.`);
    return found;
  }

  async update(id: number, updateDto: UpdateSubcategoriaDto): Promise<Subcategoria> {
    const payload: any = {};
    if ((updateDto as any).nombre !== undefined) payload.nombre = (updateDto as any).nombre;
    if ((updateDto as any).categoria_id !== undefined) payload.categoriaId = (updateDto as any).categoria_id;

    const preloaded = await this.subcategoriaRepo.preload({ id, ...payload });
    if (!preloaded) throw new NotFoundException(`Subcategoría con ID ${id} no encontrada.`);
    return this.subcategoriaRepo.save(preloaded);
  }

  async remove(id: number): Promise<void> {
    const entidad = await this.subcategoriaRepo.findOne({ where: { id } });
    if (!entidad) throw new NotFoundException(`Subcategoría con ID ${id} no encontrada.`);
    await this.subcategoriaRepo.remove(entidad);
    return;
  }
}