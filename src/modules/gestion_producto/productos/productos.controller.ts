import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put, // Lo mantenemos por si lo necesitas, pero usaremos Patch
    Patch, // <-- 🔑 IMPORTAMOS PATCH
    Delete,
    Query,
    Logger,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
    // Eliminamos @Query ya que no filtraremos por URL
    // Query, 
    // BadRequestException
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../../../common/services/r2.service';
import { memoryStorage } from 'multer';

@Controller('productos')
export class ProductosController {
    private readonly logger = new Logger('ProductosController');
     constructor(
    private readonly r2: R2Service,
    private readonly productosService: ProductosService,
  ) {}

    @Post()
    create(@Body() dto: CreateProductoDto) {
        return this.productosService.create(dto);
    }
    // Endpoint de estadísticas globales de productos
    @Get('stats')
    async getStats() {
        try {
            const stats = await this.productosService.getStats();
            return stats;
        } catch (err) {
            return { error: 'Error al obtener estadísticas de productos.' };
        }
    }

    @Get()
    async findAll(
        // 🔑 Recibir parámetros de consulta
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
        @Query('search') search: string = '',
        @Query('estado_stock') estado_stock: string = '', // El filtro del frontend
    ) {
        try {
            const pageNum = Number.parseInt(page as any, 10);
            const limitNum = Number.parseInt(limit as any, 10);
            const safePage = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
            const safeLimit = Number.isNaN(limitNum) || limitNum < 1 ? 5 : limitNum;

            const productos = await this.productosService.getAllProductos(
                safePage,
                safeLimit,
                search,
                estado_stock,
            );
            return productos; // Devuelve { data: Producto[], total: number }
        } catch (err) {
            this.logger.error('Error en GET /productos', err?.stack || err);
            // Re-lanzamos para que Nest genere el 500 estándar, pero ya quedó logueado
            throw err;
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productosService.findOneWithRelations(+id);
    }

    // 🔑 CAMBIO CLAVE: Cambiamos @Put por @Patch para que coincida con el frontend
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
        this.logger.log(`PATCH /productos/${id} body: ${JSON.stringify(dto)}`);
        return this.productosService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productosService.remove(+id);
    }
     @Post(':id/upload-imagen')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImagen(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const { url } = await this.r2.uploadBuffer(file.buffer, file.originalname, file.mimetype);
    // Guardar URL en producto
    const updated = await this.productosService.update(+id, { imagen_url: url });
    return { url, producto: updated };
  }
}