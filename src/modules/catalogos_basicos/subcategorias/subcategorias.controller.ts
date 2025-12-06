// subcategorias/subcategorias.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { SubcategoriasService } from './subcategorias.service';
import type { Subcategoria } from './entities/subcategoria.entity';
import type { CreateSubcategoriaDto } from './dtos/create-subcategoria.dto';
import type { UpdateSubcategoriaDto } from './dtos/update-subcategoria.dto';

@Controller('subcategorias') // Ruta base: /subcategorias
export class SubcategoriasController {
  constructor(private readonly subcategoriasService: SubcategoriasService) {}

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
}