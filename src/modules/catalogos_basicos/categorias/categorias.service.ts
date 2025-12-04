import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';


const cleanAndNormalizeName = (name: string): string => {
  if (!name) return '';

 
  let cleanedName = name.toLowerCase();


  cleanedName = cleanedName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");


  cleanedName = cleanedName.replace(/[^a-z0-9\s]/g, ''); 

  // 4. Eliminar espacios duplicados y trim
  cleanedName = cleanedName.replace(/\s+/g, ' ').trim(); 

  return cleanedName;
};

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const { nombre } = dto;

    // 1. Limpiar y normalizar el nombre de entrada
    const nombreNormalizado = cleanAndNormalizeName(nombre);

    if (!nombreNormalizado) {
        throw new BadRequestException('El nombre de la categoría no puede estar vacío.');
    }

    // 2. Buscar si ya existe la versión normalizada en la base de datos (LOWER() replica la limpieza)
    const existe = await this.categoriaRepository
      .createQueryBuilder('categoria')
      .where('LOWER(REPLACE(REPLACE(REPLACE(categoria.nombre, "á", "a"), "é", "e"), "í", "i")) = :nombreNormalizado', { nombreNormalizado })
      .getOne();

    
    const existeCaseInsensitive = await this.categoriaRepository
      .createQueryBuilder('categoria')
      .where('LOWER(categoria.nombre) = :nombre', { nombre: nombre.toLowerCase() })
      .getOne();
      
    if (existeCaseInsensitive) {
      throw new BadRequestException('La categoría con ese nombre ya existe. Por favor, use otro nombre.');
    }

    const dataToSave: any = {
      ...dto,
      estadoId: dto.estadoId || 1,
    };

    // Soporte para payloads en snake_case desde el frontend
    if ((dto as any)['categoria_principal_id'] !== undefined) {
      dataToSave.categoriaPrincipalId = (dto as any)['categoria_principal_id'];
    } else if ((dto as any).categoriaPrincipalId !== undefined) {
      dataToSave.categoriaPrincipalId = (dto as any).categoriaPrincipalId;
    }

    try {
      const categoria = this.categoriaRepository.create(dataToSave as unknown as Categoria);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') { 
        throw new BadRequestException('La categoría con ese nombre ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: ['estado', 'categoria_principal'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['estado', 'categoria_principal'],
    });
    if (!categoria)
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    if (dto.nombre) {
      const nombreNormalizado = dto.nombre.toLowerCase();
      
      const existe = await this.categoriaRepository
        .createQueryBuilder('categoria')
        .where('LOWER(categoria.nombre) = :nombre', { nombre: nombreNormalizado })
        .andWhere('categoria.id != :id', { id }) // Excluir la categoría que estamos editando
        .getOne();

      if (existe) {
        throw new BadRequestException('Ya existe otra categoría con ese nombre.');
      }
    }
    
    // Mapear posibles keys en snake_case recibidas desde frontend
    const dataToUpdate: any = { ...dto };
    if ((dto as any)['categoria_principal_id'] !== undefined) {
      dataToUpdate.categoriaPrincipalId = (dto as any)['categoria_principal_id'];
      delete dataToUpdate['categoria_principal_id'];
    }

    await this.categoriaRepository.update(id, dataToUpdate);
    
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