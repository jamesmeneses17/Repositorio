import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoCaracteristicaDto } from './create-producto-caracteristica.dto';

export class UpdateProductoCaracteristicaDto extends PartialType(CreateProductoCaracteristicaDto) {}
