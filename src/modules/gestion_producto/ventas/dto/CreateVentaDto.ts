// src/ventas/dto/create-venta.dto.ts

import {
  IsInt,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importar o decorador

export class CreateVentaDto {
  @ApiProperty({ description: 'Data da venda no formato YYYY-MM-DD' })
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @ApiProperty({ description: 'ID do produto vendido', minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  productoId: number;

  @ApiProperty({ description: 'Quantidade vendida', minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ description: 'Custo unitário da mercadoria', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  costo_unitario: number;

  @ApiProperty({ description: 'Preço unitário de venda', minimum: 0.01 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  precio_venta: number;
}