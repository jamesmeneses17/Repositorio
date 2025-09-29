import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEspecificacionDto } from './dto/create-especificacion.dto';
import { UpdateEspecificacionDto } from './dto/update-especificacion.dto';
import { Especificacion } from './entities/especificacion.entity';

@Injectable()
export class EspecificacionesService {
  constructor(
    @InjectRepository(Especificacion)
    private readonly especificacionesRepo: Repository<Especificacion>,
  ) { }

  async create(dto: CreateEspecificacionDto): Promise<Especificacion> {
    const especificacion = this.especificacionesRepo.create(dto);
    return this.especificacionesRepo.save(especificacion);
  }

  async findAll(): Promise<Especificacion[]> {
    return this.especificacionesRepo.find();
  }

  async findOne(id: number): Promise<Especificacion> {
    const especificacion = await this.especificacionesRepo.findOne({ where: { id } });
    if (!especificacion) {
      throw new NotFoundException(`Especificación con id ${id} no encontrada`);
    }
    return especificacion;
  }

  async update(id: number, dto: UpdateEspecificacionDto): Promise<Especificacion> {
    const especificacion = await this.findOne(id);
    Object.assign(especificacion, dto);
    return this.especificacionesRepo.save(especificacion);
  }

  async remove(id: number): Promise<void> {
    const especificacion = await this.findOne(id);
    await this.especificacionesRepo.remove(especificacion);
  }
}
