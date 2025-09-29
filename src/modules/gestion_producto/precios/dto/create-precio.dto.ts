import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePrecioDto {
  @IsOptional()
  @IsNumber()
  valor_unitario?: number;

  @IsDateString()
  fecha_inicio: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;
}
