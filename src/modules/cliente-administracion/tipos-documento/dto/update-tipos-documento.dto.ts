// src/tipos-documento/dto/update-tipos-documento.dto.ts

import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

// NOTA: Es común extender el DTO de creación, pero lo hacemos explícito para claridad.
export class UpdateTipoDocumentoDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' }) // Se valida si se envía
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres.' })
  nombre?: string; 
}