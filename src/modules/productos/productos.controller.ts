import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
    constructor(private readonly productosService: ProductosService) { }

    @Post()
    create(@Body() dto: CreateProductoDto) {
        return this.productosService.create(dto);
    }

    @Get()
    findAll() {
        return this.productosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productosService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
        return this.productosService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productosService.remove(id);
    }

    @Patch(':id/aumentar-stock')
    aumentarStock(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStockDto,
    ) {
        return this.productosService.aumentarStock(id, dto.cantidad);
    }

    @Patch(':id/disminuir-stock')
    disminuirStock(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStockDto,
    ) {
        return this.productosService.disminuirStock(id, dto.cantidad);
    }


}
