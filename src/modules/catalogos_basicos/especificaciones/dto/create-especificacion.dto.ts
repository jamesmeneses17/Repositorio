import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEspecificacionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
