// src/creditos/creditos.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreditosService } from './creditos.service';
import { CreateCreditoDto } from './dtos/create-credito.dto';

@Controller('creditos')
export class CreditosController {
  constructor(private readonly service: CreditosService) {}

  @Post()
  crear(@Body() dto: CreateCreditoDto) {
    return this.service.crearCredito(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: number) {
    return this.service.buscar(id);
  }
}
