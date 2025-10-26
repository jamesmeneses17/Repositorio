// src/tipos-documento/tipos-documento.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { TiposDocumentoService } from './tipos-documento.service';
import { UpdateTipoDocumentoDto } from './dto/update-tipos-documento.dto';
import { CreateTipoDocumentoDto } from './dto/create-tipos-documento.dto';
import { TipoDocumentoResponseDto } from './dto/tipo-documento.response.dto'; // Importamos el DTO de SALIDA

// EL INTERCEPTOR DE SERIALIZACIÓN ES VITAL: Le dice a NestJS qué formato usar para la SALIDA.
@UseInterceptors(ClassSerializerInterceptor) 
@Controller('tipos-documento')
export class TiposDocumentoController {
    constructor(private readonly tiposDocumentoService: TiposDocumentoService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    // Tipamos la respuesta para usar el DTO de SALIDA (que incluye 'id')
    create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto): Promise<TipoDocumentoResponseDto> {
        return this.tiposDocumentoService.create(createTipoDocumentoDto);
    }

    @Get()
    findAll(): Promise<TipoDocumentoResponseDto[]> { 
        return this.tiposDocumentoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<TipoDocumentoResponseDto> {
        return this.tiposDocumentoService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto): Promise<TipoDocumentoResponseDto> {
        return this.tiposDocumentoService.update(+id, updateTipoDocumentoDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
        return this.tiposDocumentoService.remove(+id);
    }
}