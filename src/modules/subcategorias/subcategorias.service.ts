import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategoria } from './entities/subcategoria.entity';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Injectable()
export class SubcategoriasService {
  constructor(
    @InjectRepository(Subcategoria)
    private readonly subcategoriasRepository: Repository<Subcategoria>,
  ) {}

  async create(dto: CreateSubcategoriaDto): Promise<Subcategoria> {
    const subcategoria = this.subcategoriasRepository.create(dto);
    return await this.subcategoriasRepository.save(subcategoria);
  }

  async findAll(): Promise<Subcategoria[]> {
    return await this.subcategoriasRepository.find({
      relations: ['categoria'], // trae la relación con categoría
    });
  }

  async findOne(id: number): Promise<Subcategoria> {
    const subcategoria = await this.subcategoriasRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!subcategoria) {
      throw new NotFoundException(`Subcategoría con ID ${id} no encontrada`);
    }
    return subcategoria;
  }

  async update(id: number, dto: UpdateSubcategoriaDto): Promise<Subcategoria> {
    const subcategoria = await this.findOne(id);
    Object.assign(subcategoria, dto);
    return await this.subcategoriasRepository.save(subcategoria);
  }

  async remove(id: number): Promise<void> {
    const subcategoria = await this.findOne(id);
    await this.subcategoriasRepository.remove(subcategoria);
  }
}
