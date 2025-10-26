// src/metodos-pago/metodos-pago.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodos-pago.dto';
import { MetodoPago } from './entities/metodos-pago.entity';

@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  @Post()
  create(@Body() createMetodoPagoDto: CreateMetodoPagoDto): Promise<MetodoPago> {
    return this.metodosPagoService.create(createMetodoPagoDto);
  }

  @Get()
  findAll(): Promise<MetodoPago[]> {
    // Aquí podrías agregar lógica de paginación o filtrado si la necesitas
    return this.metodosPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MetodoPago> {
    return this.metodosPagoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMetodoPagoDto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    return this.metodosPagoService.update(id, updateMetodoPagoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para eliminaciones exitosas
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.metodosPagoService.remove(id).then(() => { /* void */ });
  }
}