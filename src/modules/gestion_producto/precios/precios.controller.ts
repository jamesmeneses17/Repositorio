import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PreciosService } from './precios.service';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';

@Controller('precios')
export class PreciosController {
  constructor(private readonly preciosService: PreciosService) {}

  @Post()
  create(@Body() dto: CreatePrecioDto) {
    return this.preciosService.create(dto);
  }

  @Get()
  findAll() {
    return this.preciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preciosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrecioDto) {
    return this.preciosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preciosService.remove(+id);
  }
}
