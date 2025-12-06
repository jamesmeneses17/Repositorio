// src/modules/configuracion_web/informacion_empresa/informacion-empresa.service.ts

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InformacionEmpresa } from './entities/informacion-empresa.entity';
import { CreateInformacionEmpresaDto } from './dtos/create-informacion-empresa.dto';
import { UpdateInformacionEmpresaDto } from './dtos/update-informacion-empresa.dto';

@Injectable()
export class InformacionEmpresaService {
  constructor(
    @InjectRepository(InformacionEmpresa)
    private readonly infoRepository: Repository<InformacionEmpresa>,
  ) {}

  /**
   * Obtiene el único registro de información de la empresa.
   * Si no existe, devuelve una excepción o null (depende de la necesidad del front).
   */
  async findOne(): Promise<InformacionEmpresa> {
    const info = await this.infoRepository.findOne({ where: { id: 1 } });

    if (!info) {
      // Usamos NotFoundException y le indicamos al front que debe crear el registro
      throw new NotFoundException('El registro de información de empresa no existe. Debe crearlo primero.');
    }

    return info;
  }

  /**
   * Crea el registro inicial (solo si no existe).
   */
  async create(createDto: CreateInformacionEmpresaDto): Promise<InformacionEmpresa> {
    const existing = await this.infoRepository.findOne({ where: { id: 1 } });
    
    if (existing) {
      throw new InternalServerErrorException('El registro ya existe. Use el método de actualización (PUT).');
    }

    const newInfo = this.infoRepository.create({
      id: 1, // Forzamos el ID a 1 para garantizar un solo registro
      ...createDto,
    });
    
    return this.infoRepository.save(newInfo);
  }

  /**
   * Actualiza el registro existente.
   */
  async update(updateDto: UpdateInformacionEmpresaDto): Promise<InformacionEmpresa> {
    // 1. Buscamos el registro único
    const infoToUpdate = await this.findOne(); // Reutilizamos la función findOne para manejar el error 404

    // 2. Aplicamos los cambios del DTO
    const updatedEntity = this.infoRepository.merge(infoToUpdate, updateDto);

    // 3. Guardamos y retornamos
    return this.infoRepository.save(updatedEntity);
  }
}