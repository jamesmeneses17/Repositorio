import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadMedida } from './entities/unidad-medida.entity';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';

@Injectable()
export class UnidadesMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private readonly unidadMedidaRepository: Repository<UnidadMedida>,
  ) { }

  create(createUnidadMedidaDto: CreateUnidadMedidaDto) {
    const unidad = this.unidadMedidaRepository.create(createUnidadMedidaDto);
    return this.unidadMedidaRepository.save(unidad);
  }

  findAll() {
    return this.unidadMedidaRepository.find();
  }

  async findOne(id: number) {
    const unidad = await this.unidadMedidaRepository.findOne({
      where: { id },
    });
    if (!unidad) throw new NotFoundException(`Unidad de medida con id ${id} no encontrada`);
    return unidad;
  }

  async update(id: number, updateUnidadMedidaDto: UpdateUnidadMedidaDto) {
    const unidad = await this.findOne(id);
    Object.assign(unidad, updateUnidadMedidaDto);
    return this.unidadMedidaRepository.save(unidad);
  }

  async remove(id: number) {
    const unidad = await this.findOne(id);
    return this.unidadMedidaRepository.remove(unidad);
  }
}
