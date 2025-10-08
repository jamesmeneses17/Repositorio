import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity'; 
@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.find();
  }

  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({ where: { id } });
    if (!estado) {
      throw new NotFoundException(`Estado con id ${id} no encontrado`);
    }
    return estado;
  }
}