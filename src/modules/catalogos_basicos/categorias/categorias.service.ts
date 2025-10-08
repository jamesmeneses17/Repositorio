import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const dataToSave = {
      ...dto,
      estadoId: dto.estadoId || 1,
    };
    const categoria = this.categoriaRepository.create(dataToSave);
    return await this.categoriaRepository.save(categoria);
  }

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: ['estado'], // Asegura que la relación 'estado' se cargue para la tabla del front
      order: {
        id: 'DESC',
      },
    });
  }

  // ✅ BUENA PRÁCTICA: Asegurar que findOne también carga el estado para el formulario de edición
  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['estado'], // Incluir el estado
    });
    if (!categoria) throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {


    await this.categoriaRepository.update(id, dto);


    const categoriaActualizada = await this.findOne(id);

    if (!categoriaActualizada) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada después de actualizar`);
    }

    return categoriaActualizada;
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }
}