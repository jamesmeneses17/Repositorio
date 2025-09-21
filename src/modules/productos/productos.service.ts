import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Marca } from '../marcas/entities/marca.entity';
import { Subcategoria } from '../subcategorias/entities/subcategoria.entity';
import { UnidadMedida } from '../unidades-medida/entities/unidades-medida.entity';
import { FichaTecnica } from '../fichas-tecnicas/entities/fichas-tecnica.entity';
import { EspecificacionesTecnicas } from '../especificaciones-tecnicas/entities/especificaciones-tecnica.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Marca) private readonly marcaRepo: Repository<Marca>,
    @InjectRepository(Subcategoria) private readonly subcategoriaRepo: Repository<Subcategoria>,
    @InjectRepository(UnidadMedida) private readonly unidadRepo: Repository<UnidadMedida>,
    @InjectRepository(FichaTecnica) private readonly fichaRepo: Repository<FichaTecnica>,
    @InjectRepository(EspecificacionesTecnicas) private readonly especificacionesRepo: Repository<EspecificacionesTecnicas>,
  ) { }

  async create(dto: CreateProductoDto): Promise<Producto> {
    const subcategoria = await this.subcategoriaRepo.findOne({ where: { id: dto.subcategoriaId } });
    if (!subcategoria) throw new NotFoundException(`Subcategoría con id ${dto.subcategoriaId} no encontrada`);

    const marca = await this.marcaRepo.findOne({ where: { id: dto.marcaId } });
    if (!marca) throw new NotFoundException(`Marca con id ${dto.marcaId} no encontrada`);

    const unidad = await this.unidadRepo.findOne({ where: { id: dto.unidadMedidaId } });
    if (!unidad) throw new NotFoundException(`Unidad de medida con id ${dto.unidadMedidaId} no encontrada`);

    let ficha: FichaTecnica | undefined = undefined;
    if (dto.fichaTecnicaId) {
      const fichaTecnica = await this.fichaRepo.findOne({ where: { id: dto.fichaTecnicaId } });
      if (!fichaTecnica) throw new NotFoundException(`Ficha técnica con id ${dto.fichaTecnicaId} no encontrada`);
      ficha = fichaTecnica;
    }

    let especificaciones: EspecificacionesTecnicas | undefined = undefined;
    if (dto.especificacionesTecnicasId) {
      const especificacionesTecnicas = await this.especificacionesRepo.findOne({ where: { id: dto.especificacionesTecnicasId } });
      if (!especificacionesTecnicas) throw new NotFoundException(`Especificaciones técnicas con id ${dto.especificacionesTecnicasId} no encontradas`);
      especificaciones = especificacionesTecnicas;
    }

    const producto = this.productoRepo.create({
      nombre: dto.nombre,
      codigo: dto.codigo,
      especificacionesTecnicas: especificaciones,
      valorUnitario: dto.valorUnitario,
      imagenUrl: dto.imagenUrl,
      stock: dto.stock,
      enPromocion: dto.enPromocion,
      descuento: dto.descuento,
      subcategoria,
      marca,
      unidadMedida: unidad,
      fichaTecnica: ficha,
    });

    return this.productoRepo.save(producto);
  } findAll(): Promise<Producto[]> {
    return this.productoRepo.find({
      relations: ['marca', 'subcategoria', 'unidadMedida', 'fichaTecnica', 'especificacionesTecnicas']
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepo.findOne({
      where: { id },
      relations: ['marca', 'subcategoria', 'unidadMedida', 'fichaTecnica', 'especificacionesTecnicas']
    });
    if (!producto) throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);

    if (dto.subcategoriaId) {
      const subcategoria = await this.subcategoriaRepo.findOne({ where: { id: dto.subcategoriaId } });
      if (!subcategoria) throw new NotFoundException(`Subcategoría con id ${dto.subcategoriaId} no encontrada`);
      producto.subcategoria = subcategoria;
    }

    if (dto.marcaId) {
      const marca = await this.marcaRepo.findOne({ where: { id: dto.marcaId } });
      if (!marca) throw new NotFoundException(`Marca con id ${dto.marcaId} no encontrada`);
      producto.marca = marca;
    }

    if (dto.unidadMedidaId) {
      const unidad = await this.unidadRepo.findOne({ where: { id: dto.unidadMedidaId } });
      if (!unidad) throw new NotFoundException(`Unidad de medida con id ${dto.unidadMedidaId} no encontrada`);
      producto.unidadMedida = unidad;
    }

    if (dto.fichaTecnicaId) {
      const ficha = await this.fichaRepo.findOne({ where: { id: dto.fichaTecnicaId } });
      if (!ficha) throw new NotFoundException(`Ficha técnica con id ${dto.fichaTecnicaId} no encontrada`);
      producto.fichaTecnica = ficha;
    }

    if (dto.especificacionesTecnicasId) {
      const especificaciones = await this.especificacionesRepo.findOne({ where: { id: dto.especificacionesTecnicasId } });
      if (!especificaciones) throw new NotFoundException(`Especificaciones técnicas con id ${dto.especificacionesTecnicasId} no encontradas`);
      producto.especificacionesTecnicas = especificaciones;
    }

    // Actualizar solo las propiedades que no son relaciones
    const { subcategoriaId, marcaId, unidadMedidaId, fichaTecnicaId, especificacionesTecnicasId, ...updateData } = dto;
    Object.assign(producto, updateData);

    return this.productoRepo.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepo.remove(producto);
  }
}
