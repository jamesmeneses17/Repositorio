// src/modules/configuracion_web/informacion_empresa/informacion-empresa.controller.ts

import { 
  Controller, Get, Post, Put, Body, UsePipes, ValidationPipe, 
  HttpCode, HttpStatus 
} from '@nestjs/common';

import { InformacionEmpresaService } from './informacion-empresa.service';
import { InformacionEmpresa } from './entities/informacion-empresa.entity';
import { CreateInformacionEmpresaDto } from './dtos/create-informacion-empresa.dto';
import { UpdateInformacionEmpresaDto } from './dtos/update-informacion-empresa.dto';
@Controller('configuracion/empresa') // Ruta base: /api/configuracion/empresa
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class InformacionEmpresaController {
  constructor(private readonly infoService: InformacionEmpresaService) {}

  /**
   * RUTA GET: /api/configuracion/empresa
   * Obtiene la información.
   */
  @Get()
  async getInfo(): Promise<InformacionEmpresa> {
    return this.infoService.findOne();
  }

  /**
   * RUTA POST: /api/configuracion/empresa
   * Crea el registro inicial (solo la primera vez).
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInfo(
    @Body() createDto: CreateInformacionEmpresaDto,
  ): Promise<InformacionEmpresa> {
    return this.infoService.create(createDto);
  }

  /**
   * RUTA PUT: /api/configuracion/empresa
   * Actualiza la información existente.
   */
  @Put()
  async updateInfo(
    @Body() updateDto: UpdateInformacionEmpresaDto,
  ): Promise<InformacionEmpresa> {
    return this.infoService.update(updateDto);
  }
}