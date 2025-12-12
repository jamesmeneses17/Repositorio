import { Res } from '@nestjs/common';
import type { Response } from 'express';

import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query,
    Logger,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
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

    @Get('stats')
    async getStats() {
        try {
            return await this.productosService.getStats();
        } catch (err) {
            return { error: 'Error al obtener estadísticas de productos.' };
        }
    }

    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
        @Query('search') search: string = '',
        @Query('estado_stock') estado_stock: string = '',
    ) {
        try {
            const pageNum = Number.parseInt(page, 10);
            const limitNum = Number.parseInt(limit, 10);

            const safePage = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
            const safeLimit = Number.isNaN(limitNum) || limitNum < 1 ? 5 : limitNum;

            return await this.productosService.getAllProductos(
                safePage,
                safeLimit,
                search,
                estado_stock,
            );
        } catch (err) {
            this.logger.error('Error en GET /productos', err?.stack || err);
            throw err;
        }
    }

    // 🔥 RUTA ESPECÍFICA PRIMERO
    @Get('exportar-excel')
    async exportarExcel(@Res() res: Response) {
        const buffer = await this.productosService.exportarProductosExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');
        res.send(buffer);
    }

    // 🔥 LUEGO LA RUTA DINÁMICA
    @Get(':id')
    findOne(@Param('id') id: string) {
        const num = Number(id);
        if (isNaN(num)) throw new BadRequestException('ID inválido');
        return this.productosService.findOneWithRelations(num);
    }

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
    async uploadImagen(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('type') type?: string,
    ) {
        if (!file) throw new BadRequestException('No file uploaded');

        const t = (type || 'imagen').toLowerCase();

        if (!['imagen', 'ficha_tecnica'].includes(t)) {
            throw new BadRequestException('type must be "imagen" or "ficha_tecnica"');
        }

        const { url } = await this.r2.uploadBuffer(file.buffer, file.originalname, file.mimetype);

        if (t === 'imagen') {
            const imagen = await this.productosService.saveImage(+id, url);
            const producto = await this.productosService.findOneWithRelations(+id);
            return { imagen, producto };
        } else {
            const updated = await this.productosService.update(+id, { ficha_tecnica_url: url } as any);
            return { ficha_tecnica_url: url, producto: updated };
        }
    }

    @Delete('imagenes/:imagenId')
    async deleteImagen(@Param('imagenId') imagenId: string) {
        return this.productosService.deleteImagenById(Number(imagenId));
    }
}
