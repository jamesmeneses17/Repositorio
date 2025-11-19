// src/pagos_credito/pagos_credito.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { CreatePagoCreditoDto } from './dtos/create-pago-credito.dto';
import { PagosCreditoService } from './pagos-credito.service';

@Controller('pagos-credito')
export class PagosCreditoController {
  constructor(private readonly service: PagosCreditoService) {}

  @Post()
  registrar(@Body() dto: CreatePagoCreditoDto) {
    return this.service.registrarPago(dto);
  }
}
