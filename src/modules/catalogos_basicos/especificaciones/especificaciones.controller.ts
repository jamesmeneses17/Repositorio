import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EspecificacionesService } from './especificaciones.service';
import { CreateEspecificacionDto } from './dto/create-especificacion.dto';
import { UpdateEspecificacionDto } from './dto/update-especificacion.dto';

@Controller('especificaciones')
export class EspecificacionesController {
  constructor(private readonly especificacionesService: EspecificacionesService) {}

  @Post()
  create(@Body() dto: CreateEspecificacionDto) {
    return this.especificacionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.especificacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especificacionesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEspecificacionDto) {
    return this.especificacionesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especificacionesService.remove(+id);
  }
}
