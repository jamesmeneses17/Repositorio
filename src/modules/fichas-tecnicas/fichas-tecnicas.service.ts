import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FichaTecnica } from './entities/fichas-tecnica.entity';
import { CreateFichaTecnicaDto } from './dto/create-fichas-tecnica.dto';
import { UpdateFichaTecnicaDto } from './dto/update-fichas-tecnica.dto';

@Injectable()
export class FichasTecnicasService {
  constructor(
    @InjectRepository(FichaTecnica)
    private readonly fichaTecnicaRepository: Repository<FichaTecnica>,
  ) {}
  

  async create(dto: CreateFichaTecnicaDto): Promise<FichaTecnica> {
    const ficha = this.fichaTecnicaRepository.create(dto);
    return await this.fichaTecnicaRepository.save(ficha);
  }

  async findAll(): Promise<FichaTecnica[]> {
    return await this.fichaTecnicaRepository.find();
  }

  async findOne(id: number): Promise<FichaTecnica> {
    const ficha = await this.fichaTecnicaRepository.findOne({ where: { id } });
    if (!ficha) {
      throw new NotFoundException(`Ficha técnica con ID ${id} no encontrada`);
    }
    return ficha;
  }

  async update(id: number, dto: UpdateFichaTecnicaDto): Promise<FichaTecnica> {
    const ficha = await this.findOne(id);
    Object.assign(ficha, dto);
    return await this.fichaTecnicaRepository.save(ficha);
  }

  async remove(id: number): Promise<void> {
    const ficha = await this.findOne(id);
    await this.fichaTecnicaRepository.remove(ficha);
  }
}
