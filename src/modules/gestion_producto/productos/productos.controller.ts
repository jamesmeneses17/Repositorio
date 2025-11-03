import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
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

    /**
     * Devuelve TODOS los productos disponibles en la base de datos.
     * Ya no acepta parámetros de filtro (subcategoriaId o categoriaId) en el query.
     */
    @Get()
    async findAll() {
        // ✅ CORRECCIÓN: Llamamos directamente a un método que devuelva todos.
        // Asumo que tu servicio tiene un método llamado getAllProductos() o findAll().
        // Si no existe, debes crearlo para que no aplique ninguna cláusula WHERE.
        return this.productosService.getAllProductos();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // Asumo que findOneWithRelations devuelve las relaciones (Categoría, Estado) para el formulario de edición.
        return this.productosService.findOneWithRelations(+id); 
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
        return this.productosService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productosService.remove(+id);
    }
}