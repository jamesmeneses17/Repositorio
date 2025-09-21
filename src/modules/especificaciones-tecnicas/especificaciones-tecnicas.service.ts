import { Injectable } from '@nestjs/common';
import { CreateEspecificacionesTecnicaDto } from './dto/create-especificaciones-tecnica.dto';
import { UpdateEspecificacionesTecnicaDto } from './dto/update-especificaciones-tecnica.dto';

@Injectable()
export class EspecificacionesTecnicasService {
  create(createEspecificacionesTecnicaDto: CreateEspecificacionesTecnicaDto) {
    return 'This action adds a new especificacionesTecnica';
  }

  findAll() {
    return `This action returns all especificacionesTecnicas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} especificacionesTecnica`;
  }

  update(id: number, updateEspecificacionesTecnicaDto: UpdateEspecificacionesTecnicaDto) {
    return `This action updates a #${id} especificacionesTecnica`;
  }

  remove(id: number) {
    return `This action removes a #${id} especificacionesTecnica`;
  }
}
