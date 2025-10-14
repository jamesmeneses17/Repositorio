
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    BadRequestException
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
    async findAll(
        @Query('subcategoriaId') subcategoriaIdParam?: string,
        @Query('categoriaId') categoriaIdParam?: string,

    ) {
        let filterSubId: number | undefined;
        let filterCatId: number | undefined;


        if (subcategoriaIdParam) {
            const parsedId = parseInt(subcategoriaIdParam, 10);
            if (isNaN(parsedId)) {
                throw new BadRequestException('El parámetro subcategoriaId debe ser un número válido.');
            }
            filterSubId = parsedId;
        }

        if (!filterSubId && categoriaIdParam) {
            const parsedId = parseInt(categoriaIdParam, 10);
            if (isNaN(parsedId)) {
                throw new BadRequestException('El parámetro categoriaId debe ser un número válido.');
            }
            filterCatId = parsedId;
        }

    return this.productosService.getProductosFiltrados(filterSubId, filterCatId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
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