// productos/dto/update-producto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

// Hereda todos los campos de CreateProductoDto como opcionales
export class UpdateProductoDto extends PartialType(CreateProductoDto) {}