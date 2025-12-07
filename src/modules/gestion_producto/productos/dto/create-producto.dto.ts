import { IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  // Datos básicos requeridos en el formulario
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  // Relación obligatoria: categoría (frontend envía la categoría seleccionada)
  @IsNumber()
  @IsNotEmpty()
  categoriaId: number;

  // Subcategoría opcional
  @ApiPropertyOptional({ description: 'ID de la subcategoría (opcional)' })
  @IsNumber()
  @IsOptional()
  subcategoriaId?: number | null;

  // Texto descriptivo opcional
  @IsOptional()
  @IsString()
  descripcion?: string;

  // URLs opcionales que pueden crearse vía upload separado
  @IsOptional()
  @IsString()
  ficha_tecnica_url?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;
}
