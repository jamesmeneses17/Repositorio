import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  Patch,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search = ''
  ): Promise<PaginacionResponse<PrecioConProductoCalculadoDto>> {
    return this.preciosService.findAllPaginated(
      page,
      limit,
      search
    );
  }

  // Obtener un precio por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preciosService.findOne(id);
  }

  // Actualizar un precio
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePrecioDto) {
    // Log temporal para diagnosticar payloads desde frontend
    console.log(`[PreciosController] PUT /precios/${id} body:`, dto);
    return this.preciosService.update(id, dto);
  }

  // Aceptar PATCH también por compatibilidad con el frontend
  @Patch(':id')
  patchUpdate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePrecioDto) {
    console.log(`[PreciosController] PATCH /precios/${id} body:`, dto);
    return this.preciosService.update(id, dto);
  }

  // Eliminar un precio
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preciosService.remove(id);
  }
}
