import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EspecificacionesTecnicasService } from './especificaciones-tecnicas.service';
import { CreateEspecificacionesTecnicaDto } from './dto/create-especificaciones-tecnica.dto';
import { UpdateEspecificacionesTecnicaDto } from './dto/update-especificaciones-tecnica.dto';

@Controller('especificaciones-tecnicas')
export class EspecificacionesTecnicasController {
  constructor(private readonly especificacionesTecnicasService: EspecificacionesTecnicasService) {}

  @Post()
  create(@Body() createEspecificacionesTecnicaDto: CreateEspecificacionesTecnicaDto) {
    return this.especificacionesTecnicasService.create(createEspecificacionesTecnicaDto);
  }

  @Get()
  findAll() {
    return this.especificacionesTecnicasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especificacionesTecnicasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspecificacionesTecnicaDto: UpdateEspecificacionesTecnicaDto) {
    return this.especificacionesTecnicasService.update(+id, updateEspecificacionesTecnicaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especificacionesTecnicasService.remove(+id);
  }
}
