// src/modulos/gestion_producto/precios/dto/update-precio.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreatePrecioDto } from './create-precio.dto';

// Permite actualizar solo un subconjunto de campos
export class UpdatePrecioDto extends PartialType(CreatePrecioDto) {
    // No necesita contenido adicional, hereda la estructura de CreatePrecioDto y la hace parcial (opcional).
}