import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './CreateVentaDto';

// PartialType hace que todas las propiedades de CreateVentaDto sean opcionales
export class UpdateVentaDto extends PartialType(CreateVentaDto) {}