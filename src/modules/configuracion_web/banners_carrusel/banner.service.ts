// src/modules/configuracion_web/banners/banner.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dtos/create-banner.dto';
import { UpdateBannerDto } from './dtos/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  /**
   * Obtiene todos los banners, ordenados por el campo 'orden'.
   */
  async findAll(): Promise<Banner[]> {
    return this.bannerRepository.find({
        order: { orden: 'ASC' }
    });
  }

  /**
   * Obtiene un banner por ID.
   */
  async findOne(id: number): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({ where: { id } });

    if (!banner) {
      throw new NotFoundException(`Banner con ID ${id} no encontrado.`);
    }
    return banner;
  }

  /**
   * Crea un nuevo banner.
   */
  async create(createDto: CreateBannerDto): Promise<Banner> {
    const newBanner = this.bannerRepository.create(createDto);
    return this.bannerRepository.save(newBanner);
  }

  /**
   * Actualiza un banner existente.
   */
  async update(id: number, updateDto: UpdateBannerDto): Promise<Banner> {
    const bannerToUpdate = await this.findOne(id);
    
    // Aplicamos los cambios y guardamos
    const updatedEntity = this.bannerRepository.merge(bannerToUpdate, updateDto);
    return this.bannerRepository.save(updatedEntity);
  }

  /**
   * Elimina un banner.
   */
  async remove(id: number): Promise<void> {
    const result = await this.bannerRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Banner con ID ${id} no encontrado para eliminar.`);
    }
  }
}