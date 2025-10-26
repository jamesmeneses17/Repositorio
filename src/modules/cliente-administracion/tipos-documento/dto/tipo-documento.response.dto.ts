// src/tipos-documento/dto/tipo-documento.response.dto.ts

import { IsNumber, IsString } from 'class-validator';
// NOTA: En un DTO de respuesta, IsNumber e IsString son suficientes para la serialización.

export class TipoDocumentoResponseDto {
    @IsNumber() 
    id: number; // Propiedad necesaria en la respuesta
    
    @IsString()
    nombre: string;
}