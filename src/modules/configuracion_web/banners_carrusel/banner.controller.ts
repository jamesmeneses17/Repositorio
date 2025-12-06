// src/modules/configuracion_web/banners/banner.controller.ts

import { 
  Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, 
  UsePipes, ValidationPipe, HttpCode, HttpStatus 
} from '@nestjs/common';

import { BannerService } from './banner.service';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dtos/create-banner.dto';
import { UpdateBannerDto } from './dtos/update-banner.dto';

@Controller('configuracion/banners') // Ruta base: /api/configuracion/banners
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * RUTA GET: /api/configuracion/banners
   * Obtiene todos los banners.
   */
  @Get()
  findAll(): Promise<Banner[]> {
    return this.bannerService.findAll();
  }

  /**
   * RUTA GET: /api/configuracion/banners/:id
   * Obtiene un banner por ID.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Banner> {
    return this.bannerService.findOne(id);
  }

  /**
   * RUTA POST: /api/configuracion/banners
   * Crea un nuevo banner.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateBannerDto): Promise<Banner> {
    return this.bannerService.create(createDto);
  }

  /**
   * RUTA PUT: /api/configuracion/banners/:id
   * Actualiza un banner.
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBannerDto,
  ): Promise<Banner> {
    return this.bannerService.update(id, updateDto);
  }

  /**
   * RUTA DELETE: /api/configuracion/banners/:id
   * Elimina un banner.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para éxito en eliminación
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.bannerService.remove(id);
  }
}