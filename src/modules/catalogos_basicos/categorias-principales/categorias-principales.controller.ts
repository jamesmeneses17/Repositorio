import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UpdateCategoriaPrincipalDto } from './dto/update-categoria-principal.dto';
import { CategoriasPrincipalesService } from './categorias-principales.service';
import { CreateCategoriaPrincipalDto } from './dto/create-categoria-principal.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../../../common/services/r2.service';
import { memoryStorage } from 'multer';

@Controller('categorias-principales')
export class CategoriasPrincipalesController {
  constructor(
    private readonly service: CategoriasPrincipalesService,
    private readonly r2: R2Service,
  ) {}

  @Post()
  create(@Body() dto: CreateCategoriaPrincipalDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaPrincipalDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post(':id/upload-imagen')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const { url } = await this.r2.uploadBuffer(file.buffer, file.originalname, file.mimetype);

    const updated = await this.service.update(+id, { imagen_url: url } as any);

    return { imagen_url: url, categoria_principal: updated };
  }
}
