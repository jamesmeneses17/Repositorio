import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EstadosService } from './estados.service';

@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Get()
  findAll() {
    return this.estadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadosService.findOne(id);
  }

  // Se eliminan los métodos @Post(), @Patch(), y @Delete() 
  // para proteger el catálogo fijo de estados.
}