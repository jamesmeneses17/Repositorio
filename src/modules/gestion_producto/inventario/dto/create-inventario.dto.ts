import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateInventarioDto {
  @IsInt()
  producto_id: number;

  @IsInt()
  stock: number;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsInt()
  compras?: number;

  @IsOptional()
  @IsInt()
  ventas?: number;
}
