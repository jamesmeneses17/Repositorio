import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UnidadesMedidaService } from './unidades-medida.service';
import { CreateUnidadMedidaDto } from './dto/create-unidades-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidades-medida.dto';

@Controller('unidades-medida')
export class UnidadesMedidaController {
  constructor(private readonly unidadesService: UnidadesMedidaService) {}

  @Post()
  create(@Body() createDto: CreateUnidadMedidaDto) {
    return this.unidadesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUnidadMedidaDto) {
    return this.unidadesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.remove(id);
  }
}
