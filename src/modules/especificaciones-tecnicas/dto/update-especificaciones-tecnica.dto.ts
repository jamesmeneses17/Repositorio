import { PartialType } from '@nestjs/swagger';
import { CreateEspecificacionesTecnicaDto } from './create-especificaciones-tecnica.dto';

export class UpdateEspecificacionesTecnicaDto extends PartialType(CreateEspecificacionesTecnicaDto) {}
