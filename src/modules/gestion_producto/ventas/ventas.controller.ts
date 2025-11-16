// src/ventas/ventas.controller.ts

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
} from '@nestjs/common';
import {
  ApiTags, // <-- Importar ApiTags
  ApiOperation, // <-- Importar ApiOperation
  ApiResponse, // <-- Importar ApiResponse
  ApiBody,
} from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/CreateVentaDto';
import { UpdateVentaDto } from './dto/UpdateVentaDto';
import { Venta } from './entities/venta.entity';

// Adicionar a tag para agrupar as rotas na documentação
@ApiTags('Ventas') 
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo registro de venda' })
  @ApiResponse({
    status: 201,
    description: 'Venda criada com sucesso',
    type: Venta, // Usar a entidade para mostrar o schema de resposta
  })
  @ApiBody({ type: CreateVentaDto })
  create(@Body() createVentaDto: CreateVentaDto): Promise<Venta> {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os registros de vendas' })
  @ApiResponse({ status: 200, description: 'Lista de vendas', type: [Venta] })
  findAll(): Promise<Venta[]> {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um registro de venda pelo ID' })
  @ApiResponse({ status: 200, description: 'Venda encontrada', type: Venta })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Venta> {
    return this.ventasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente um registro de venda' })
  @ApiResponse({ status: 200, description: 'Venda atualizada com sucesso', type: Venta })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVentaDto: UpdateVentaDto,
  ): Promise<Venta> {
    return this.ventasService.update(id, updateVentaDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um registro de venda pelo ID' })
  @ApiResponse({ status: 204, description: 'Venda removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ventasService.remove(id);
  }
}