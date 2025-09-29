import { IsInt, IsOptional } from 'class-validator';

export class CreateProductoCaracteristicaDto {
  @IsInt()
  producto_id: number;

  @IsOptional()
  @IsInt()
  marca_id?: number;

  @IsOptional()
  @IsInt()
  subcategoria_id?: number;

  @IsOptional()
  @IsInt()
  unidad_medida_id?: number;

  @IsOptional()
  @IsInt()
  especificacion_id?: number;
}
