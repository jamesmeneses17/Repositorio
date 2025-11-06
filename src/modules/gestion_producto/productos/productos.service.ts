import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

// 🔑 IMPORTAR SERVICIOS RELACIONADOS
import { InventarioService } from '../inventario/inventario.service';
import { PreciosService } from '../precios/precios.service';

// 📌 UMBRAL FIJO DE STOCK MÍNIMO
const MIN_STOCK_THRESHOLD = 5; // 🔑 valor fijo para definir stock bajo

// 📌 TIPADO PARA LA RESPUESTA DE LA LISTA
interface ProductoConStockCalculado extends Producto {
  stock: number;
  precio: number;
  estado_stock: 'Suficiente' | 'Stock Bajo' | 'Agotado';
}

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepo: Repository<Producto>,
    private readonly inventarioService: InventarioService,
    private readonly preciosService: PreciosService,
  ) {}

  // 🔹 CREATE (sin stockMinimo)
  async create(dto: CreateProductoDto): Promise<Producto> {
    // 1️⃣ Separar campos: (stock, ubicacion, precio)
    const { stock, ubicacion, precio, ...productoData } = dto;

    // 2️⃣ Crear producto principal
    const dataToSave = {
      ...productoData,
      estadoId: productoData.estadoId || 1,
    };

    const producto = this.productosRepo.create(dataToSave);
    const savedProducto = await this.productosRepo.save(producto);
    const productoId = savedProducto.id;

    // 3️⃣ Crear/Actualizar Inventario (ya sin stockMinimo)
    if (stock !== undefined || ubicacion !== undefined) {
      await this.inventarioService.actualizarInventarioPorProductoId(
        productoId,
        stock ?? 0,
        ubicacion,
      );
    }

    // 4️⃣ Crear precio inicial
    if (precio !== undefined && precio !== null) {
      await this.preciosService.actualizarPrecioPorProductoId(productoId, precio);
    }

    return this.findOneWithRelations(productoId);
  }

  // 🚀 GET ALL con estado de stock calculado usando umbral fijo
  async getAllProductos(): Promise<ProductoConStockCalculado[]> {
    const productos = await this.productosRepo.find({
      relations: ['estado', 'precios', 'inventario', 'categoria'],
    });

    return productos.map((p) => {
      const inventarioRegistro = p.inventario?.[0];
      const stockActual = inventarioRegistro?.stock ?? 0;

      // ✅ Usar el umbral fijo
      const stockMinimo = MIN_STOCK_THRESHOLD;

      let estadoStock: 'Disponible' | 'Stock Bajo' | 'Agotado';
      if (stockActual === 0) {
        estadoStock = 'Agotado';
      } else if (stockActual <= stockMinimo) {
        estadoStock = 'Stock Bajo';
      } else {
        estadoStock = 'Disponible';
      }

      const precioActual = p.precios?.[0]?.valor_unitario ?? 0;

      return {
        ...p,
        stock: stockActual,
        precio: precioActual,
        estado_stock: estadoStock,
        stockMinimo: stockMinimo, // opcional si el frontend lo usa
      } as ProductoConStockCalculado;
    });
  }

  // 🔍 GET ONE con relaciones
  async findOneWithRelations(id: number): Promise<Producto> {
    const producto = await this.productosRepo.findOne({
      where: { id },
      relations: ['precios', 'inventario', 'estado', 'categoria'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    const inventarioRegistro = producto.inventario?.[0];
    (producto as any).stock = inventarioRegistro?.stock || 0;
    (producto as any).precio = producto.precios?.[0]?.valor_unitario || 0;

    return producto;
  }

  // 🔹 UPDATE (sin stockMinimo)
  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    // 1️⃣ Separar campos
    const { stock, ubicacion, precio, ...productoData } = dto;

    // 2️⃣ Preload del producto base
    const productoPreloaded = await this.productosRepo.preload({
      id,
      ...productoData,
    });

    if (!productoPreloaded) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado para actualizar.`);
    }

    // 3️⃣ Guardar producto principal
    await this.productosRepo.save(productoPreloaded);

    // 4️⃣ Actualizar inventario (sin stock mínimo)
    if (stock !== undefined || ubicacion !== undefined) {
      await this.inventarioService.actualizarInventarioPorProductoId(
        id,
        typeof stock === 'number' ? stock : 0,
        typeof ubicacion === 'string' ? ubicacion : undefined,
      );
    }

    // 5️⃣ Actualizar precio
    if (precio !== undefined && precio !== null) {
      await this.preciosService.actualizarPrecioPorProductoId(id, precio);
    }

    return this.findOneWithRelations(id);
  }

  // 🔹 DELETE
  async remove(id: number): Promise<void> {
    const producto = await this.findOneWithRelations(id);
    await this.productosRepo.remove(producto);
  }
}
