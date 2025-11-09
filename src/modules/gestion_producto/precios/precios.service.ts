import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Precio } from './entities/precio.entity';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';

// 📦 Tipados auxiliares
export interface PaginacionResponse<T> {
  data: T[];
  total: number;
}

export interface PrecioConProductoCalculadoDto extends Precio {
  costo: number;
  precioBase: number;
  precioFinal: number;
  // Campos adicionales para compatibilidad con frontend
  descuento_porcentaje?: number;
  valor_final?: number;
  estado: 'Normal' | 'En Promoción' | 'Vencido';
}

@Injectable()
export class PreciosService {
  constructor(
    @InjectRepository(Precio)
    private readonly precioRepository: Repository<Precio>,
  ) {}

  // =========================================================================
  // CRUD BÁSICO
  // =========================================================================

  create(dto: CreatePrecioDto) {
    // Mapear campo del DTO (descuento_porcentaje) al nombre de columna real (descuento)
    const payload: any = { ...dto };
    if (payload.descuento_porcentaje !== undefined) {
      payload.descuento = payload.descuento_porcentaje;
      delete payload.descuento_porcentaje;
    }
    const nuevoPrecio = this.precioRepository.create(payload);
    return this.precioRepository.save(nuevoPrecio);
  }

  findAll() {
    return this.precioRepository.find();
  }

  findOne(id: number) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('ID de precio inválido');
    }
    return this.precioRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdatePrecioDto) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('ID de precio inválido');
    }
    // Mapear dto para evitar campos que no existan en la entidad
    const payload: any = { ...dto };
    if (payload.descuento_porcentaje !== undefined) {
      payload.descuento = payload.descuento_porcentaje;
      delete payload.descuento_porcentaje;
    }
    await this.precioRepository.update(id, payload);
    return this.findOne(id);
  }

  async remove(id: number) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('ID de precio inválido');
    }
    const precio = await this.findOne(id);
    if (!precio) {
      throw new NotFoundException(`Precio con id ${id} no encontrado`);
    }
    return this.precioRepository.remove(precio);
  }

  findAllWithRelations() {
    return this.precioRepository.find({
      relations: ['producto', 'unidadMedida'],
    });
  }

  findOneWithRelations(id: number) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('ID de precio inválido');
    }
    return this.precioRepository.findOne({
      where: { id },
      relations: ['producto', 'unidadMedida'],
    });
  }

  // =========================================================================
  // ✅ MÉTODO USADO DESDE ProductosService
  // =========================================================================
  async actualizarPrecioPorProductoId(
    productoId: number,
    nuevoValor: number,
  ): Promise<Precio> {
    let precioRegistro = await this.precioRepository.findOne({
      where: { producto: { id: productoId } },
      order: { id: 'DESC' },
    });

    if (!precioRegistro) {
      precioRegistro = this.precioRepository.create({
        producto: { id: productoId } as any,
        valor_unitario: nuevoValor,
        fecha_inicio: new Date().toISOString().slice(0, 10),
        fecha_fin: null,
      });
    } else {
      precioRegistro.valor_unitario = nuevoValor;
    }
    return this.precioRepository.save(precioRegistro);
  }

  // =========================================================================
  // ✅ LÓGICA DE CÁLCULO Y MAPEADO
  // =========================================================================
  private calcularPrecioFinalYEstado(
    precio: Precio,
  ): PrecioConProductoCalculadoDto {
    const descuentoPorcentaje = precio.descuento || 0;
    const descuentoFactor = descuentoPorcentaje / 100;

  const precioFinal = precio.valor_unitario * (1 - descuentoFactor);

    // 🔎 Determinar estado (vigencia/promoción)
    const hoy = new Date();
    let estado: 'Normal' | 'En Promoción' | 'Vencido' = 'Normal';

    if (precio.fecha_fin && new Date(precio.fecha_fin) < hoy) {
      estado = 'Vencido';
    } else if (descuentoPorcentaje > 0) {
      estado = 'En Promoción';
    }

    const mapped: any = {
      ...precio,
      // 🔑 Mapeo hacia el frontend
      costo: precio.producto?.precio_costo || 0,
      precioBase: precio.valor_unitario,
      precioFinal: Math.round(precioFinal * 100) / 100,
      // Campos que el frontend espera
      descuento_porcentaje: precio.descuento || 0,
      valor_final: Math.round(precioFinal * 100) / 100,
      estado,
      producto: precio.producto,
    };

    return mapped as PrecioConProductoCalculadoDto;
  }

  // =========================================================================
  // ✅ PAGINACIÓN CON CÁLCULO Y RELACIONES
  // =========================================================================
  async findAllPaginated(
    page = 1,
    limit = 10,
    search = '',
  ): Promise<PaginacionResponse<PrecioConProductoCalculadoDto>> {
    const skip = (page - 1) * limit;

    const [precios, total] = await this.precioRepository.findAndCount({
      where: search
        ? [
            { producto: { nombre: ILike(`%${search}%`) } },
            { producto: { codigo: ILike(`%${search}%`) } },
          ]
        : {},
      relations: ['producto'],
      order: { id: 'DESC' },
      skip,
      take: limit,
    });

    const dataCalculada = precios.map((p) =>
      this.calcularPrecioFinalYEstado(p),
    );

    return { data: dataCalculada, total };
  }

  // =========================================================================
  // ✅ ESTADÍSTICAS GLOBALES DE PRECIOS
  // =========================================================================
  async getStats() {
    const precios = await this.precioRepository.find({
      relations: ['producto'],
    });

    let total = precios.length;
    let enPromocion = 0;
    let vencidos = 0;
    let promedio = 0;

    for (const p of precios) {
      const calculado = this.calcularPrecioFinalYEstado(p);
      promedio += calculado.precioFinal;
      if (calculado.estado === 'En Promoción') enPromocion++;
      if (calculado.estado === 'Vencido') vencidos++;
    }

    promedio = total > 0 ? Math.round((promedio / total) * 100) / 100 : 0;

    return {
      total,
      enPromocion,
      vencidos,
      promedio,
    };
  }
}
