// src/metodos-pago/dto/update-metodo-pago.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMetodoPagoDto } from './create-metodos-pago.dto';

// PartialType hace que todas las propiedades de CreateMetodoPagoDto sean opcionales
export class UpdateMetodoPagoDto extends PartialType(CreateMetodoPagoDto) {}