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
  @IsOptional() // O IsNotEmpty(), si el precio inicial es obligatorio
  precio?: number; // Usaremos esto para crear el registro en la tabla 'precios'

  @IsNumber()
  @IsOptional()
  stock?: number; // Usaremos esto para crear el registro en la tabla 'inventario'

  @IsOptional()
  @IsString()
  ubicacion?: string; // Campo de la tabla 'inventario'
}