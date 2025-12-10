import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

import { Compra } from './entities/compra.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Inventario } from '../inventario/entities/inventario.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepo: Repository<Compra>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  // ===== CREAR =====
  async create(dto: CreateCompraDto) {

    // Normalizar fecha: si no viene, usar undefined (NO null)
    const fechaNormalizada =
      dto.fecha ? String(dto.fecha).split('T')[0] : undefined;

    // Mapeo manual ANTES de crear "data"
    let productoId: number | undefined = undefined;

    if ((dto as any).producto_id !== undefined) {
      productoId = (dto as any).producto_id;
    }

    const data: Partial<Compra> = {
      ...dto,
      fecha: fechaNormalizada,
      productoId,
    };

    // Cargar producto si viene productoId
    let producto: Producto | null = null;
    if (productoId) {
      producto = await this.productoRepo.findOne({
        where: { id: productoId },
        relations: ['inventario', 'subcategoria'],
      });
      if (!producto) throw new NotFoundException('Producto no encontrado');

      // Garantizar registro de inventario asociado
      if (!producto.inventario) {
        const inventarioCreado = this.inventarioRepo.create({
          productoId: producto.id,
          stock: 0,
          compras: 0,
          ventas: 0,
        });
        const inventarioGuardado = await this.inventarioRepo.save(inventarioCreado);
        producto.inventario = inventarioGuardado;
      }

      data.categoriaId =
        (producto.subcategoria as any)?.categoriaId ?? undefined;
    }

    const compra = this.compraRepo.create(data);
    const compraGuardada = await this.compraRepo.save(compra);

    // ===== ACTUALIZAR INVENTARIO Y PRECIO DE COSTO =====
    if (producto && data.costo_unitario && data.cantidad) {
      const costoUnitario = Number(data.costo_unitario);
      const cantidad = Number(data.cantidad);

      const stockAnterior = producto.inventario?.stock ?? 0;
      const precioCostoAnterior = Number(producto.precio_costo) || 0;

      let precioCostoNuevo: number;

      if (stockAnterior === 0) {
        precioCostoNuevo = costoUnitario;
      } else {
        precioCostoNuevo =
          (precioCostoAnterior * stockAnterior +
            costoUnitario * cantidad) /
          (stockAnterior + cantidad);
      }

      await this.productoRepo.update(producto.id, {
        precio_costo: precioCostoNuevo,
      });

      if (producto.inventario) {
        await this.inventarioRepo.update(producto.inventario.id, {
          stock: stockAnterior + cantidad,
          compras: (producto.inventario.compras ?? 0) + cantidad,
        });
      } else {
        // Crear registro de inventario si no existía
        const nuevoInventario = this.inventarioRepo.create({
          productoId: producto.id,
          stock: stockAnterior + cantidad,
          compras: cantidad,
          ventas: 0,
        });
        await this.inventarioRepo.save(nuevoInventario);
      }

      const productoActualizado = await this.productoRepo.findOne({
        where: { id: producto.id },
        relations: ['inventario'],
      });

      if (productoActualizado) {
        compraGuardada.producto = productoActualizado;
      }
    }

    return compraGuardada;
  }

  // ===== LISTAR =====
  findAll() {
    return this.compraRepo.find({
      relations: ['producto', 'producto.inventario'],
      order: { id: 'DESC' },
    });
  }

  // ===== BUSCAR UNA =====
  async findOne(id: number) {
    const compra = await this.compraRepo.findOne({
      where: { id },
      relations: ['producto', 'producto.inventario'],
    });

    if (!compra) throw new NotFoundException('Compra no encontrada');

    return compra;
  }

  // ===== ACTUALIZAR =====
  async update(id: number, dto: UpdateCompraDto) {
    const data: any = { id, ...dto };

    if ((dto as any).fecha) {
      data.fecha = String(dto.fecha).split('T')[0];
    }

    if ((dto as any).producto_id !== undefined) {
      const productoId = (dto as any).producto_id;

      data.productoId = productoId;

      const producto = await this.productoRepo.findOne({
        where: { id: productoId },
        relations: ['subcategoria'],
      });

      if (!producto) throw new NotFoundException('Producto no encontrado');

      data.categoriaId =
        (producto.subcategoria as any)?.categoriaId ?? undefined;
    }

    const compra = await this.compraRepo.preload(data);

    if (!compra) throw new NotFoundException('Compra no encontrada');

    return this.compraRepo.save(compra);
  }

  // ===== ELIMINAR =====
  async remove(id: number) {
    const compra = await this.findOne(id);
    return this.compraRepo.remove(compra);
  }
}
