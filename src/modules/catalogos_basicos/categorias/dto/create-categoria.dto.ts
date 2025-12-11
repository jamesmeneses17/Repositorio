import { IsNotEmpty, IsString, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsNumber()
  @IsOptional()
  activo?: number;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsNumber()
  @IsOptional()
  categoriaPrincipalId?: number | null;
}