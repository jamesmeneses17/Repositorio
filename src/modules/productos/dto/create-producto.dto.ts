import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsDecimal } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty() @IsString() nombre: string;
  @IsNotEmpty() @IsString() codigo: string;
  @IsNotEmpty() @IsNumber() valorUnitario: number;
  @IsOptional()
  @IsNumber()
  especificacionesTecnicasId?: number;
  @IsOptional() @IsString() imagenUrl?: string;
  @IsOptional() @IsNumber() stock?: number;
  @IsOptional() @IsBoolean() enPromocion?: boolean;
  @IsOptional() @IsDecimal() descuento?: number;

  @IsNotEmpty() @IsNumber() subcategoriaId: number;
  @IsNotEmpty() @IsNumber() marcaId: number;
  @IsNotEmpty() @IsNumber() unidadMedidaId: number;
  @IsOptional() @IsNumber() fichaTecnicaId?: number;
}
