import { IsInt, IsString, IsDateString, IsNumber, Min, Length } from 'class-validator';

export class CreateCompraDto {
  @IsString()
  @Length(1, 50)
  codigo: string;

  @IsDateString()
  fecha: string;

  @IsInt()
  producto_id: number;

  @IsInt()
  categoria_id: number;

  @IsInt()
  @Min(1, { message: 'La cantidad mínima es 1' })
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El costo debe ser mayor o igual a 0' })
  costo_unitario: number;
}
