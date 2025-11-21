// src/pagos_credito/pagos_credito.controller.ts

import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CreatePagoCreditoDto } from './dtos/create-pago-credito.dto';
import { PagosCreditoService } from './pagos-credito.service';

@Controller('pagos-credito')
export class PagosCreditoController {
  constructor(private readonly service: PagosCreditoService) {}

  @Post()
  registrar(@Body() dto: CreatePagoCreditoDto) {
    return this.service.registrarPago(dto);
  }

  @Get('credito/:id')
  findByCredito(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByCredito(id);
  }
}
