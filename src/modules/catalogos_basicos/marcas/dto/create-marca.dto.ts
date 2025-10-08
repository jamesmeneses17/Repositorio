import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsOptional()
  estadoId?: number;
}