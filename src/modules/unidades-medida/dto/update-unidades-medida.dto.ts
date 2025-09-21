import { PartialType } from '@nestjs/mapped-types';
import { CreateUnidadMedidaDto } from './create-unidades-medida.dto';

export class UpdateUnidadMedidaDto extends PartialType(CreateUnidadMedidaDto) { }
