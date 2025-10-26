// src/tipos-documento/tipos-documento.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDocumento } from './entities/tipos-documento.entity';
import { CreateTipoDocumentoDto } from './dto/create-tipos-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipos-documento.dto';

@Injectable()
export class TiposDocumentoService {
  constructor(
    @InjectRepository(TipoDocumento)
    private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
  ) {}

  // Crear un nuevo Tipo de Documento
  async create(createTipoDocumentoDto: CreateTipoDocumentoDto): Promise<TipoDocumento> {
    const tipoDocumento = this.tipoDocumentoRepository.create (createTipoDocumentoDto);
    return this.tipoDocumentoRepository.save(tipoDocumento);
  }

  // Obtener todos los Tipos de Documento
  async findAll(): Promise<TipoDocumento[]> {
    return this.tipoDocumentoRepository.find();
  }

  // Obtener un solo Tipo de Documento por ID
  async findOne(id: number): Promise<TipoDocumento> {
    const tipoDocumento = await this.tipoDocumentoRepository.findOne({ where: { id } });
    if (!tipoDocumento) {
      throw new NotFoundException(`Tipo de Documento con ID ${id} no encontrado.`);
    }
    return tipoDocumento;
  }

  // Actualizar un Tipo de Documento
  async update(id: number, updateTipoDocumentoDto: UpdateTipoDocumentoDto): Promise<TipoDocumento> {
    const tipoDocumento = await this.findOne(id); // Verifica si existe

    // Combina los datos existentes con los nuevos DTOs
    const updatedTipoDocumento = this.tipoDocumentoRepository.merge(tipoDocumento, updateTipoDocumentoDto);
    
    return this.tipoDocumentoRepository.save(updatedTipoDocumento);
  }

  // Eliminar un Tipo de Documento
  async remove(id: number): Promise<void> {
    const result = await this.tipoDocumentoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Tipo de Documento con ID ${id} no encontrado.`);
    }
  }
}