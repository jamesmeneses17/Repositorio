import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoriaPrincipalDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNumber()
  @IsOptional()
  activo?: number;

  @IsString()
  @IsOptional()
  imagen_url?: string;
}
