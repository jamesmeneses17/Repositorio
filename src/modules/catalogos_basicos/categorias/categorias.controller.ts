import { Controller, Get, Post, Body, Patch, Put, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../../../common/services/r2.service';
import { memoryStorage } from 'multer';

@Controller('categorias')
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService,
    private readonly r2: R2Service,
  ) {}

  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }

  @Post(':id/upload-imagen')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImagen(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const { url } = await this.r2.uploadBuffer(file.buffer, file.originalname, file.mimetype);

    const updated = await this.categoriasService.update(id, { imagen_url: url } as any);

    return { imagen_url: url, categoria: updated };
  }
}
