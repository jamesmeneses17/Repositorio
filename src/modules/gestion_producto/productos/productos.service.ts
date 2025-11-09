import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

// Entidad Precio para crear el registro inicial
import { Precio } from '../precios/entities/precio.entity';

// 🔑 Servicios relacionados
import { InventarioService } from '../inventario/inventario.service';
import { PreciosService } from '../precios/precios.service';

// 📌 UMBRAL FIJO DE STOCK MÍNIMO
const MIN_STOCK_THRESHOLD = 5;

// 📌 Tipado para la respuesta de la lista y paginación
export interface PaginacionResponse<T> {
  data: T[];
  total: number;
}

export interface ProductoConStockCalculado extends Producto {
  stock: number;
  precio: number;
  estado_stock: 'Disponible' | 'Stock Bajo' | 'Agotado';
}

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepo: Repository<Producto>,
    private readonly inventarioService: InventarioService,
    private readonly preciosService: PreciosService,
    private readonly dataSource: DataSource,
  ) {}

async getAllProductos(
  page: number = 1,
  limit: number = 5,
  search: string = '',
  estado_stock: string = '',
): Promise<PaginacionResponse<ProductoConStockCalculado>> {
  // 1. Construir query base
  const query = this.productosRepo.createQueryBuilder('producto');
  query
    .leftJoinAndSelect('producto.estado', 'estado')
    .leftJoinAndSelect('producto.categoria', 'categoria')
    .leftJoinAndSelect('producto.inventario', 'inventario')
    .leftJoinAndSelect('producto.precios', 'precios', 'precios.fecha_fin IS NULL')
    .orderBy('producto.id', 'DESC');

  if (search) {
    query.andWhere(
      '(producto.nombre LIKE :search OR producto.codigo LIKE :search)',
      { search: `%${search}%` },
    );
  }

  // 2. Obtener resultados de base de datos
  const productosRaw = await query.getMany();

  // 3. Calcular stock y usar precio de costo (NO precio de venta)
  const productosCalculados = productosRaw.map((p) => {
    const inventarioRegistro = p.inventario?.[0];
    const stockActual = inventarioRegistro?.stock ?? 0;
    const stockMinimo = MIN_STOCK_THRESHOLD;

    let estadoStock: 'Disponible' | 'Stock Bajo' | 'Agotado';
    if (stockActual === 0) estadoStock = 'Agotado';
    else if (stockActual <= stockMinimo) estadoStock = 'Stock Bajo';
    else estadoStock = 'Disponible';

    // ✅ Aquí el cambio: usar precio_costo directamente
    const precioActual = p.precio_costo ?? 0;

    return {
      ...p,
      stock: stockActual,
      precio: precioActual, // ← este campo ahora es costo
      estado_stock: estadoStock,
      stockMinimo,
    } as ProductoConStockCalculado;
  });

  // 4. Filtrar por estado_stock si aplica
  let productosFiltrados = productosCalculados;
  if (estado_stock && estado_stock !== '') {
    productosFiltrados = productosCalculados.filter(
      (p) => p.estado_stock === estado_stock,
    );
  }

  // 5. Paginación
  const total = productosFiltrados.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginados = productosFiltrados.slice(start, end);

  return { data: paginados, total };
}


      // Estadísticas globales de productos por estado_stock
      async getStats() {
          // Obtener todos los productos y calcular estado_stock
          const productosRaw = await this.productosRepo.createQueryBuilder('producto')
              .leftJoinAndSelect('producto.inventario', 'inventario')
              .leftJoinAndSelect('producto.precios', 'precios', 'precios.fecha_fin IS NULL')
              .getMany();

          // Calcular estado_stock para cada producto
          let total = 0, stockBajo = 0, agotado = 0;
          for (const p of productosRaw) {
              const inventarioRegistro = p.inventario?.[0];
              const stockActual = inventarioRegistro?.stock ?? 0;
              let estadoStock: 'Disponible' | 'Stock Bajo' | 'Agotado';
              if (stockActual === 0) estadoStock = 'Agotado';
              else if (stockActual <= MIN_STOCK_THRESHOLD) estadoStock = 'Stock Bajo';
              else estadoStock = 'Disponible';
              total++;
              if (estadoStock === 'Stock Bajo') stockBajo++;
              if (estadoStock === 'Agotado') agotado++;
          }
          return { total, stockBajo, agotado };
      }
  // 🔹 CREATE
  async create(dto: CreateProductoDto): Promise<Producto> {
    const { stock, ubicacion, precio, codigo, nombre, precio_costo, valor_unitario_inicial, ...productoData } = dto;
    // Validar si el código ya existe
    if (codigo) {
      const existeCodigo = await this.productosRepo.findOne({ where: { codigo } });
      if (existeCodigo) {
        throw new ConflictException({ message: 'El producto ya existe' });
      }
    }
    // Validar si el nombre ya existe (case-insensitive)
    if (nombre) {
      const existeNombre = await this.productosRepo.createQueryBuilder('producto')
        .where('LOWER(producto.nombre) = LOWER(:nombre)', { nombre })
        .getOne();
      if (existeNombre) {
        throw new ConflictException({ message: 'El producto ya existe' });
      }
    }
    // Usar transacción para crear producto y precio inicial de forma atómica
    const nuevoProducto = await this.dataSource.transaction(async (manager) => {
      const productoRepo = manager.getRepository(Producto);
      const precioRepo = manager.getRepository(Precio);

      const dataToSave = {
        ...productoData,
        codigo,
        nombre,
        precio_costo: precio_costo ?? 0,
        estadoId: productoData.estadoId || 1,
      };

      const producto = productoRepo.create(dataToSave);
      const savedProducto = await productoRepo.save(producto);

      // Crear precio inicial si se proporcionó
      const valorInicial =
        valor_unitario_inicial !== undefined && valor_unitario_inicial !== null
          ? valor_unitario_inicial
          : precio;

      if (valorInicial !== undefined && valorInicial !== null) {
        const precioInicial = precioRepo.create({
          producto: { id: savedProducto.id } as any,
          productoId: savedProducto.id,
          valor_unitario: valorInicial,
          descuento: 0,
          en_promocion: false,
          fecha_inicio: new Date().toISOString().slice(0, 10),
          fecha_fin: null,
        });
        await precioRepo.save(precioInicial);
      }

      return savedProducto;
    });

    const productoId = nuevoProducto.id;

    if (stock !== undefined || ubicacion !== undefined) {
      await this.inventarioService.actualizarInventarioPorProductoId(
        productoId,
        stock ?? 0,
        ubicacion,
      );
    }

    return this.findOneWithRelations(productoId);
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

  // 🔹 UPDATE
  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const { stock, ubicacion, precio, ...productoData } = dto;

    const productoPreloaded = await this.productosRepo.preload({
      id,
      ...productoData,
    });

    if (!productoPreloaded) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado para actualizar.`);
    }

    await this.productosRepo.save(productoPreloaded);

    if (stock !== undefined || ubicacion !== undefined) {
      await this.inventarioService.actualizarInventarioPorProductoId(
        id,
        typeof stock === 'number' ? stock : 0,
        typeof ubicacion === 'string' ? ubicacion : undefined,
      );
    }

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
