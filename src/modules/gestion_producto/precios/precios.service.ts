import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Precio } from './entities/precio.entity';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';

@Injectable()
export class PreciosService {
    constructor(
        @InjectRepository(Precio)
        private readonly precioRepository: Repository<Precio>,
    ) {}

    create(dto: CreatePrecioDto) {
        const nuevoPrecio = this.precioRepository.create(dto);
        return this.precioRepository.save(nuevoPrecio);
    }

    findAll() {
        return this.precioRepository.find();
    }

    findOne(id: number) {
        return this.precioRepository.findOne({
            where: { id },
        });
    }

    async update(id: number, dto: UpdatePrecioDto) {
        await this.precioRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
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
        return this.precioRepository.findOne({
            where: { id },
            relations: ['producto', 'unidadMedida'],
        });
    }

// =========================================================================
// ✅ MÉTODO REQUERIDO PARA GESTIÓN DESDE ProductosService
// =========================================================================
    /**
     * Busca el último registro de precio asociado al producto y lo actualiza,
     * o crea un registro nuevo si no existe.
     */
    async actualizarPrecioPorProductoId(
        productoId: number, 
        nuevoValor: number
    ): Promise<Precio> {
        // 1. Buscar el registro de precio más reciente (o el que se desea actualizar)
        let precioRegistro = await this.precioRepository.findOne({ 
            where: { producto: { id: productoId } },
            order: { id: 'DESC' }
        });

        if (!precioRegistro) {
            precioRegistro = this.precioRepository.create({
                producto: { id: productoId } as any,
                valor_unitario: nuevoValor,
                fecha_inicio: new Date().toISOString().slice(0, 10), // formato YYYY-MM-DD
                fecha_fin: null,
            });
        } else {
            precioRegistro.valor_unitario = nuevoValor;
        }
        return this.precioRepository.save(precioRegistro);
    }
}