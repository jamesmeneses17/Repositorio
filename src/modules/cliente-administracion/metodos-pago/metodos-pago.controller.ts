// src/metodos-pago/metodos-pago.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodos-pago.dto';
import { MetodoPago } from './entities/metodos-pago.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  // Crear nuevo método de pago
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMetodoPagoDto: CreateMetodoPagoDto): Promise<MetodoPago> {
    return this.metodosPagoService.create(createMetodoPagoDto);
  }

  // Obtener todos los métodos de pago
  @Get()
  findAll(): Promise<MetodoPago[]> {
    return this.metodosPagoService.findAll();
  }

  // Obtener un método de pago por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MetodoPago> {
    return this.metodosPagoService.findOne(id);
  }

  // Actualizar un método de pago
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMetodoPagoDto: UpdateMetodoPagoDto,
  ): Promise<MetodoPago> {
    return this.metodosPagoService.update(id, updateMetodoPagoDto);
  }

  // Eliminar un método de pago
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.metodosPagoService.remove(id);
  }
}
