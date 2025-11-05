import { IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  codigo: string;

  @IsOptional()
  @IsString()
  ficha_tecnica_url?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  estadoId?: number;

  @IsNumber()
  @IsOptional()
  categoriaId?: number;

  // Campos para inventario
  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsOptional()
  @IsString()
  ubicacion?: string;
}