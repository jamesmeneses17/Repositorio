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
        const categoria = this.categoriaRepository.create(dto);
        return await this.categoriaRepository.save(categoria);
    }

    async findAll(): Promise<Categoria[]> {
        return await this.categoriaRepository.find();
    }

    async findOne(id: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOneBy({ id });
        if (!categoria) {
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return categoria;
    }

    async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
        const categoria = await this.findOne(id);
        Object.assign(categoria, dto);
        return await this.categoriaRepository.save(categoria);
    }

    async remove(id: number): Promise<void> {
        const categoria = await this.findOne(id);
        await this.categoriaRepository.remove(categoria);
    }
}
