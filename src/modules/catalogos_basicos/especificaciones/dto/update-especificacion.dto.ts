import { PartialType } from '@nestjs/mapped-types';
import { CreateEspecificacionDto } from './create-especificacion.dto';

export class UpdateEspecificacionDto extends PartialType(CreateEspecificacionDto) {}
