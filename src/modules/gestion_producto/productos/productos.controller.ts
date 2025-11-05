import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put, // Lo mantenemos por si lo necesitas, pero usaremos Patch
    Patch, // <-- 🔑 IMPORTAMOS PATCH
    Delete,
    // Eliminamos @Query ya que no filtraremos por URL
    // Query, 
    // BadRequestException
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
    constructor(private readonly productosService: ProductosService) { }

    @Post()
    create(@Body() dto: CreateProductoDto) {
        return this.productosService.create(dto);
    }

    @Get()
    async findAll() {
        return this.productosService.getAllProductos();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productosService.findOneWithRelations(+id); 
    }

    // 🔑 CAMBIO CLAVE: Cambiamos @Put por @Patch para que coincida con el frontend
    @Patch(':id') 
    update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
        return this.productosService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productosService.remove(+id);
    }
}