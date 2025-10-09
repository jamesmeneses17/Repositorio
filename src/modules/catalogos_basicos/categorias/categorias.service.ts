import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  ) {}

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const { nombre } = dto;

    const existe = await this.categoriaRepository.findOne({ where: { nombre } });
    if (existe) {
      throw new BadRequestException('La categoría con ese nombre ya existe');
    }

    const dataToSave = {
      ...dto,
      estadoId: dto.estadoId || 1,
    };

    try {
      const categoria = this.categoriaRepository.create(dataToSave);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      // 🧩 Manejo adicional por si MySQL lanza un error de duplicado directamente
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('La categoría con ese nombre ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: ['estado'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['estado'],
    });
    if (!categoria)
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
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
