// src/metodos-pago/dto/create-metodo-pago.dto.ts
import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateMetodoPagoDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres.' })
  nombre: string;
}