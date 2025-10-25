// src/tipos-documento/tipos-documento.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TiposDocumentoService } from './tipos-documento.service';
import { TipoDocumento } from './entities/tipos-documento.entity';
import { UpdateTipoDocumentoDto } from './dto/update-tipos-documento.dto';
import { CreateTipoDocumentoDto } from './dto/create-tipos-documento.dto';

@Controller('tipos-documento')
export class TiposDocumentoController {
  constructor(private readonly tiposDocumentoService: TiposDocumentoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto): Promise<TipoDocumento> {
    return this.tiposDocumentoService.create(createTipoDocumentoDto);
  }

  // Endpoint necesario para el formulario de Clientes
  @Get()
  findAll(): Promise<TipoDocumento[]> {
    return this.tiposDocumentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TipoDocumento> {
    return this.tiposDocumentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto): Promise<TipoDocumento> {
    return this.tiposDocumentoService.update(+id, updateTipoDocumentoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.tiposDocumentoService.remove(+id);
  }
}