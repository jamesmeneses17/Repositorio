import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductosCaracteristicasService } from './productos-caracteristicas.service';
import { CreateProductoCaracteristicaDto } from './dto/create-producto-caracteristica.dto';
import { UpdateProductoCaracteristicaDto } from './dto/update-producto-caracteristica.dto';

@Controller('producto-caracteristicas')
export class ProductosCaracteristicasController {
  constructor(private readonly service: ProductosCaracteristicasService) { }

  @Post()
  create(@Body() dto: CreateProductoCaracteristicaDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateProductoCaracteristicaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
