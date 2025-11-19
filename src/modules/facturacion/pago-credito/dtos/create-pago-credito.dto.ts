// src/pagos_credito/dto/create-pago.dto.ts
import { IsNumber, Min } from 'class-validator';

export class CreatePagoCreditoDto {
  @IsNumber()
  credito_id: number;

  @IsNumber()
  @Min(1)
  monto_pago: number;
}
