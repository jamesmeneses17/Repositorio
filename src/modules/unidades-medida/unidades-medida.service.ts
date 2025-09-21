import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnidadMedidaDto } from './dto/create-unidades-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidades-medida.dto';
import { UnidadMedida } from './entities/unidades-medida.entity';

@Injectable()
export class UnidadesMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private readonly unidadMedidaRepository: Repository<UnidadMedida>,
  ) { }

  async create(createDto: CreateUnidadMedidaDto): Promise<UnidadMedida> {
    const unidad = this.unidadMedidaRepository.create(createDto);
    return this.unidadMedidaRepository.save(unidad);
  }

  findAll(): Promise<UnidadMedida[]> {
    return this.unidadMedidaRepository.find({ relations: ['productos'] });
  }

  async findOne(id: number): Promise<UnidadMedida> {
    const unidad = await this.unidadMedidaRepository.findOne({
      where: { id },
      relations: ['productos']
    });
    if (!unidad) throw new NotFoundException(`Unidad de medida con id ${id} no encontrada`);
    return unidad;
  }

  async update(id: number, updateDto: UpdateUnidadMedidaDto): Promise<UnidadMedida> {
    const unidad = await this.findOne(id);
    Object.assign(unidad, updateDto);
    return this.unidadMedidaRepository.save(unidad);
  }

  async remove(id: number): Promise<void> {
    const unidad = await this.findOne(id);
    await this.unidadMedidaRepository.remove(unidad);
  }
}
