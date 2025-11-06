// backend-ventas/src/catalogs_basicos/estados/estados.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // 👈 IMPORTANTE: Importar 'In'
import { Estado } from './entities/estado.entity'; 

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async findAll(): Promise<Estado[]> {
    // 🔑 IDs de los estados relevantes para la gestión de un Producto:
    // 1: Disponible, 2: Stock Bajo, 4: Agotado (según tu DB)
    const PRODUCTO_ESTADO_IDS = [1, 2, 4]; 

    return this.estadoRepository.find({
      where: {
        // Filtra la consulta para incluir solo los IDs especificados
        id: In(PRODUCTO_ESTADO_IDS), 
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Estado> {
    // ... código findOne sin cambios
    const estado = await this.estadoRepository.findOne({ where: { id } });
    if (!estado) {
      throw new NotFoundException(`Estado con id ${id} no encontrado`);
    }
    return estado;
  }
}