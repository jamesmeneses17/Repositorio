import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateCategoriaPrincipalDto } from './dto/update-categoria-principal.dto';
import { CategoriasPrincipalesService } from './categorias-principales.service';
import { CreateCategoriaPrincipalDto } from './dto/create-categoria-principal.dto';

@Controller('categorias-principales')
export class CategoriasPrincipalesController {
  constructor(private readonly service: CategoriasPrincipalesService) {}

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
}
