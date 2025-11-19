// src/creditos/dto/create-credito.dto.ts
import { IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateCreditoDto {
  @IsNumber()
  cliente_id: number;

  @IsString()
  articulo: string;

  @IsNumber()
  @Min(1)
  valor_credito: number;

  @IsDateString()
  fecha_inicial: string;

  @IsDateString()
  fecha_final: string;
}
