// src/tipos-documento/dto/create-tipo-documento.dto.ts

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTipoDocumentoDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres.' })
  nombre: string;

}