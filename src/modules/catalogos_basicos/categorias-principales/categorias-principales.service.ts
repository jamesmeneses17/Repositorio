import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoriaPrincipalDto } from './dto/update-categoria-principal.dto';
import { CategoriaPrincipal } from './entitiies/categoria-principal.entity';
import { CreateCategoriaPrincipalDto } from './dto/create-categoria-principal.dto';

@Injectable()
export class CategoriasPrincipalesService {
  constructor(
    @InjectRepository(CategoriaPrincipal)
    private readonly repo: Repository<CategoriaPrincipal>,
  ) {}

  create(dto: CreateCategoriaPrincipalDto) {
    const nueva = this.repo.create({
      ...dto,
      activo: dto.activo ?? 1,
      imagenUrl: (dto as any).imagen_url,
    });
    return this.repo.save(nueva);
  }

  findAll() {
    return this.repo.find({
      relations: ['categorias'],
    });
  }

  async findOne(id: number) {
    const data = await this.repo.findOne({
      where: { id },
      relations: ['categorias'],
    });

    if (!data) throw new NotFoundException('Categoria principal no encontrada');
    return data;
  }

  async update(id: number, dto: UpdateCategoriaPrincipalDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Categoria principal eliminada' };
  }
}
