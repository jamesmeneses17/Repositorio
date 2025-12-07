import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Subcategoria } from '../../catalogos_basicos/subcategorias/entities/subcategoria.entity';
import { Categoria } from '../../catalogos_basicos/categorias/entities/categoria.entity';
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

export type ProductoConStockCalculado = Omit<Producto, 'compras'> & {
  stock: number;
  precio: number;
  precio_venta: number;
  estado_stock: 'Disponible' | 'Stock Bajo' | 'Agotado';
  // Campos copiados desde la relación inventario para consumo directo del frontend
  compras: number;
  ventas?: number;
  ubicacion?: string | null;
};

@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepo: Repository<Producto>,
    @InjectRepository(Subcategoria)
    private readonly subcategoriaRepo: Repository<Subcategoria>,
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
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
    .leftJoinAndSelect('producto.subcategoria', 'subcategoria')
    .leftJoinAndSelect('subcategoria.categoria', 'categoria')
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
  const inventarioRegistro = p.inventario; // ahora es objeto OneToOne
  const stockActual = inventarioRegistro?.stock ?? 0;
    const stockMinimo = MIN_STOCK_THRESHOLD;

    let estadoStock: 'Disponible' | 'Stock Bajo' | 'Agotado';
    if (stockActual === 0) estadoStock = 'Agotado';
    else if (stockActual <= stockMinimo) estadoStock = 'Stock Bajo';
    else estadoStock = 'Disponible';

    // ✅ Aquí el cambio: usar precio_costo directamente para el campo 'precio' (costo)
    const precioActual = p.precio_costo ?? 0;
    // Precio de venta efectivo (si existe un registro en 'precios' tomar su valor, sino usar el campo producto.precio_venta)
    const precioVentaActual = p.precios?.[0]?.valor_unitario ?? p.precio_venta ?? 0;

    return {
      ...p,
      // Mantener compatibilidad con frontend que muestra la columna 'CATEGORÍA'
      // Mostramos el nombre de la subcategoría aquí para que la tabla muestre subcategorías.
      categoria: p.subcategoria?.nombre ?? null,
      stock: stockActual,
      precio: precioActual, // ← este campo ahora es costo
      precio_venta: precioVentaActual,
      estado_stock: estadoStock,
      stockMinimo,
      // Exponer compras/ventas/ubicacion en la raíz para facilitar consumo del frontend
      compras: inventarioRegistro?.compras ?? 0,
      ventas: inventarioRegistro?.ventas ?? 0,
      ubicacion: inventarioRegistro?.ubicacion ?? null,
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
              const inventarioRegistro = p.inventario;
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
    const { stock, ubicacion, precio, precio_venta, codigo, nombre, precio_costo, valor_unitario_inicial, ...productoData } = dto as any;

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

      // Compatibilidad: el frontend puede enviar `categoriaId` (nivel 2) y/o `subcategoriaId` (nivel 3).
      // NOTA: No mapear `categoriaId` a `subcategoriaId`. La subcategoría es opcional y solo debe llenarse
      // si el frontend envía explícitamente `subcategoriaId`.
      const incomingSubcategoriaId = (productoData as any).subcategoriaId ?? (productoData as any).subcategoria_id ?? null;
      const incomingCategoriaId = (productoData as any).categoriaId ?? (productoData as any).categoria_id ?? null;

      const dataToSave = {
        ...productoData,
        codigo,
        nombre,
        precio_costo: precio_costo ?? 0,
        estadoId: productoData.estadoId || 1,
        // Para creación, si no se envía subcategoria, guardamos NULL (producto sin subcategoría)
        subcategoriaId: incomingSubcategoriaId,
        categoriaId: incomingCategoriaId,
      };

      this.logger.log(`Create producto - dataToSave.subcategoriaId=${dataToSave.subcategoriaId}`);
      const producto = productoRepo.create(dataToSave);
      const savedProducto: any = await productoRepo.save(producto);
      this.logger.log(`Created producto id=${savedProducto.id} subcategoriaId=${savedProducto.subcategoriaId}`);

      // Crear precio inicial si se proporcionó
      const valorInicial =
        valor_unitario_inicial !== undefined && valor_unitario_inicial !== null
          ? valor_unitario_inicial
          : (precio_venta !== undefined && precio_venta !== null ? precio_venta : precio);

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

    const productoId = (nuevoProducto as any).id;

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
      relations: ['precios', 'inventario', 'estado', 'subcategoria'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

  const inventarioRegistro = producto.inventario;
  (producto as any).stock = inventarioRegistro?.stock || 0;
  (producto as any).precio = producto.precios?.[0]?.valor_unitario || producto.precio_costo || 0;
  // Exponer precio_venta calculado (si existe un precio activo, usarlo; sino usar el campo producto.precio_venta)
  (producto as any).precio_venta = producto.precios?.[0]?.valor_unitario ?? producto.precio_venta ?? 0;
  // Copiar compras/ventas/ubicacion al objeto producto para el detalle
  (producto as any).compras = inventarioRegistro?.compras ?? 0;
  (producto as any).ventas = inventarioRegistro?.ventas ?? 0;
  (producto as any).ubicacion = inventarioRegistro?.ubicacion ?? null;

  // Compatibilidad: exponer 'categoria' como nombre de la subcategoría para el frontend
  (producto as any).categoria = producto.subcategoria ? (producto.subcategoria as any).nombre : null;

    return producto;
  }

  // 🔹 UPDATE
  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    // Cargar la entidad existente con relación a subcategoria
    const producto = await this.productosRepo.findOne({ where: { id }, relations: ['subcategoria'] });
    if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado para actualizar.`);

    this.logger.log(`[updateProducto] payload final: ${JSON.stringify(dto)}`);

    const anyDto: any = dto as any;
    const hasSubcategoriaProp = Object.prototype.hasOwnProperty.call(anyDto, 'subcategoriaId')
      || Object.prototype.hasOwnProperty.call(anyDto, 'categoriaId')
      || Object.prototype.hasOwnProperty.call(anyDto, 'subcategoria_id')
      || Object.prototype.hasOwnProperty.call(anyDto, 'categoria_id');

    // Asignar solo propiedades definidas (excepto las variantes de subcategoria)
    for (const key of Object.keys(anyDto)) {
      if (['subcategoriaId', 'categoriaId', 'subcategoria_id', 'categoria_id'].includes(key)) continue;
      const val = anyDto[key];
      if (val !== undefined) (producto as any)[key] = val;
    }

    // Manejar subcategoria solo si viene explícita en el DTO
    if (hasSubcategoriaProp) {
      const rawSubId = anyDto.categoriaId ?? anyDto.subcategoriaId ?? anyDto.subcategoria_id ?? anyDto.categoria_id;
      const subId = rawSubId === undefined ? undefined : (rawSubId === null ? null : Number(rawSubId));

      this.logger.log(`[updateProducto] incomingSubcategoriaId=${rawSubId}`);

      if (subId === null) {
        producto.subcategoria = null;
        (producto as any).subcategoriaId = null;
      } else if (subId !== undefined && !Number.isNaN(subId)) {
        const subcat = await this.subcategoriaRepo.findOneBy({ id: subId });
        if (!subcat) throw new NotFoundException('Subcategoría no encontrada');
        producto.subcategoria = subcat;
        (producto as any).subcategoriaId = subcat.id;
      }
    } else {
      this.logger.log(`[updateProducto] no se indicó subcategoria en el DTO; no se tocará la FK`);
    }

      // Manejar categoria (nivel 2) si viene explícita en el DTO
      const hasCategoriaProp = Object.prototype.hasOwnProperty.call(anyDto, 'categoriaId') || Object.prototype.hasOwnProperty.call(anyDto, 'categoria_id');
      if (hasCategoriaProp) {
        const rawCatId = anyDto.categoriaId ?? anyDto.categoria_id;
        const catId = rawCatId === undefined ? undefined : (rawCatId === null ? null : Number(rawCatId));
        this.logger.log(`[updateProducto] incomingCategoriaId=${rawCatId}`);
        if (catId === null) {
          producto.categoria = null as any;
          (producto as any).categoriaId = null;
        } else if (catId !== undefined && !Number.isNaN(catId)) {
          const cat = await this.categoriaRepo.findOneBy({ id: catId });
          if (!cat) throw new NotFoundException('Categoría no encontrada');
          producto.categoria = cat as any;
          (producto as any).categoriaId = cat.id;
        }
      } else {
        this.logger.log(`[updateProducto] no se indicó categoria en el DTO; no se tocará la FK`);
      }

    // Guardar
    const saved = await this.productosRepo.save(producto);
    this.logger.log(`[updateProducto] saved id=${saved.id}`);

    // Actualizar inventario si aplica
    if ((anyDto as any).stock !== undefined || (anyDto as any).ubicacion !== undefined) {
      await this.inventarioService.actualizarInventarioPorProductoId(
        id,
        typeof (anyDto as any).stock === 'number' ? (anyDto as any).stock : 0,
        typeof (anyDto as any).ubicacion === 'string' ? (anyDto as any).ubicacion : undefined,
      );
    }

    // Actualizar precio si viene
    const nuevoPrecioParaActualizar = (anyDto as any).precio_venta !== undefined && (anyDto as any).precio_venta !== null
      ? (anyDto as any).precio_venta
      : (anyDto as any).precio;
    if (nuevoPrecioParaActualizar !== undefined && nuevoPrecioParaActualizar !== null) {
      await this.preciosService.actualizarPrecioPorProductoId(id, nuevoPrecioParaActualizar);
    }

    return this.findOneWithRelations(id);
  }

  // 🔹 DELETE
  async remove(id: number): Promise<void> {
    const producto = await this.findOneWithRelations(id);
    await this.productosRepo.remove(producto);
  }
}
