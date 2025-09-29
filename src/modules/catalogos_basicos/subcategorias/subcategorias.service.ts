import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategoria } from './entities/subcategoria.entity';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class SubcategoriasService {
  constructor(
    @InjectRepository(Subcategoria)
    private readonly subcategoriaRepository: Repository<Subcategoria>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateSubcategoriaDto): Promise<Subcategoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id: dto.categoriaId } });
    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${dto.categoriaId} no encontrada`);
    }
    const subcategoria = this.subcategoriaRepository.create({
      nombre: dto.nombre,
      categoria,
    });
    return await this.subcategoriaRepository.save(subcategoria);
  }

  async findAll(): Promise<Subcategoria[]> {
    return await this.subcategoriaRepository.find();
  }

  async findOne(id: number): Promise<Subcategoria> {
    const subcategoria = await this.subcategoriaRepository.findOne({ where: { id } });
    if (!subcategoria) throw new NotFoundException(`Subcategoría con id ${id} no encontrada`);
    return subcategoria;
  }

  async update(id: number, dto: UpdateSubcategoriaDto): Promise<Subcategoria> {
    const subcategoria = await this.findOne(id);

    if (dto.categoriaId) {
      const categoria = await this.categoriaRepository.findOne({ where: { id: dto.categoriaId } });
      if (!categoria) throw new NotFoundException(`Categoría con id ${dto.categoriaId} no encontrada`);
      subcategoria.categoria = categoria;
    }

    if (dto.nombre) subcategoria.nombre = dto.nombre;

    return await this.subcategoriaRepository.save(subcategoria);
  }

  async remove(id: number): Promise<void> {
    const subcategoria = await this.findOne(id);
    await this.subcategoriaRepository.remove(subcategoria);
  }
}
