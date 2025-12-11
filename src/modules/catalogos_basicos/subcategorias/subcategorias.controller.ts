// subcategorias/subcategorias.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { SubcategoriasService } from './subcategorias.service';
import type { Subcategoria } from './entities/subcategoria.entity';
import type { CreateSubcategoriaDto } from './dtos/create-subcategoria.dto';
import type { UpdateSubcategoriaDto } from './dtos/update-subcategoria.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../../../common/services/r2.service';
import { memoryStorage } from 'multer';

@Controller('subcategorias') // Ruta base: /subcategorias
export class SubcategoriasController {
  constructor(
    private readonly subcategoriasService: SubcategoriasService,
    private readonly r2: R2Service,
  ) {}

  @Post() // POST /subcategorias
  async create(@Body() createDto: CreateSubcategoriaDto): Promise<Subcategoria> {
    return this.subcategoriasService.create(createDto);
  }

  @Get() // GET /subcategorias
  async findAll(): Promise<Subcategoria[]> {
    return this.subcategoriasService.findAll();
  }

  @Get(':id') // GET /subcategorias/1
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Subcategoria> {
    return this.subcategoriasService.findOne(id);
  }

  @Patch(':id') // PATCH /subcategorias/1
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSubcategoriaDto,
  ): Promise<Subcategoria> {
    return this.subcategoriasService.update(id, updateDto);
  }

  @Delete(':id') // DELETE /subcategorias/1
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve 204 No Content
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.subcategoriasService.remove(id);
  }

  @Post(':id/upload-imagen')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImagen(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const { url } = await this.r2.uploadBuffer(file.buffer, file.originalname, file.mimetype);

    const updated = await this.subcategoriasService.update(id, { imagen_url: url } as any);

    return { imagen_url: url, subcategoria: updated };
  }
}