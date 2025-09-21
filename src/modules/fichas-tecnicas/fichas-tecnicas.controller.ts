import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FichasTecnicasService } from './fichas-tecnicas.service';
import { UpdateFichaTecnicaDto } from './dto/update-fichas-tecnica.dto';
import { CreateFichaTecnicaDto } from './dto/create-fichas-tecnica.dto';

@ApiTags('fichas-tecnicas')
@Controller('fichas-tecnicas')
export class FichasTecnicasController {
  constructor(private readonly fichasService: FichasTecnicasService) {}

  @Post()
  create(@Body() dto: CreateFichaTecnicaDto) {
    return this.fichasService.create(dto);
  }

  @Get()
  findAll() {
    return this.fichasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fichasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFichaTecnicaDto) {
    return this.fichasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fichasService.remove(id);
  }
}
