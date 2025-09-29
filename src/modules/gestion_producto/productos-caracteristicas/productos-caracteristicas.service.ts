import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoCaracteristicaDto } from './dto/create-producto-caracteristica.dto';
import { ProductoCaracteristica } from './entities/productos-caracteristica.entity';
import { UpdateProductoCaracteristicaDto } from './dto/update-producto-caracteristica.dto';

@Injectable()
export class ProductosCaracteristicasService {
  constructor(
    @InjectRepository(ProductoCaracteristica)
    private readonly repo: Repository<ProductoCaracteristica>,
  ) { }

  create(dto: CreateProductoCaracteristicaDto) {
    const nueva = this.repo.create();
    nueva.producto = { id: dto.producto_id } as any;

    if (dto.marca_id) {
      nueva.marca = { id: dto.marca_id } as any;
    }
    if (dto.subcategoria_id) {
      nueva.subcategoria = { id: dto.subcategoria_id } as any;
    }
    if (dto.unidad_medida_id) {
      nueva.unidad_medida = { id: dto.unidad_medida_id } as any;
    }
    if (dto.especificacion_id) {
      nueva.especificacion = { id: dto.especificacion_id } as any;
    }

    return this.repo.save(nueva);
  }

  findAll() {
    return this.repo.find({
      relations: ['producto', 'marca', 'subcategoria', 'unidad_medida', 'especificacion'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['producto', 'marca', 'subcategoria', 'unidad_medida', 'especificacion'],
    });
  }

  async update(id: number, dto: UpdateProductoCaracteristicaDto) {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`ProductoCaracteristica with id ${id} not found`);
    }

    if (dto.producto_id) {
      entity.producto = { id: dto.producto_id } as any;
    }
    if (dto.marca_id !== undefined) {
      entity.marca = dto.marca_id ? ({ id: dto.marca_id } as any) : null;
    }
    if (dto.subcategoria_id !== undefined) {
      entity.subcategoria = dto.subcategoria_id ? ({ id: dto.subcategoria_id } as any) : null;
    }
    if (dto.unidad_medida_id !== undefined) {
      entity.unidad_medida = dto.unidad_medida_id ? ({ id: dto.unidad_medida_id } as any) : null;
    }
    if (dto.especificacion_id !== undefined) {
      entity.especificacion = dto.especificacion_id ? ({ id: dto.especificacion_id } as any) : null;
    }

    return this.repo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`ProductoCaracteristica with id ${id} not found`);
    }
    return this.repo.remove(entity);
  }
}
