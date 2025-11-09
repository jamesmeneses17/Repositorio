import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  Query 
} from '@nestjs/common';
import { PreciosService } from './precios.service';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';
import { PaginacionResponse } from '../../../common/interfaces/paginacion-response.interface';
import { PrecioConProductoCalculadoDto } from './dto/precio-con-producto-calculado.dto';

@Controller('precios')
export class PreciosController {
  constructor(private readonly preciosService: PreciosService) {}

  // Crear nuevo precio
  @Post()
  create(@Body() dto: CreatePrecioDto) {
    return this.preciosService.create(dto);
  }

  // Listar precios con paginación y búsqueda
  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = ''
  ): Promise<PaginacionResponse<PrecioConProductoCalculadoDto>> {
    return this.preciosService.findAllPaginated(
      parseInt(page),
      parseInt(limit),
      search
    );
  }

  // Obtener un precio por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preciosService.findOne(+id);
  }

  // Actualizar un precio
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrecioDto) {
    return this.preciosService.update(+id, dto);
  }

  // Eliminar un precio
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preciosService.remove(+id);
  }
}
