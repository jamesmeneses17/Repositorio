// src/metodos-pago/metodos-pago.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodoPagoDto } from './dto/create-metodos-pago.dto';
import { MetodoPago } from './entities/metodos-pago.entity';
import { UpdateMetodoPagoDto } from './dto/update-metodos-pago.dto';


@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepository: Repository<MetodoPago>,
  ) {}

  async create(createMetodoPagoDto: CreateMetodoPagoDto): Promise<MetodoPago> {
    const { nombre } = createMetodoPagoDto;

    // Verificar unicidad (opcional, pero buena práctica si es único en BD)
    const existing = await this.metodoPagoRepository.findOne({ where: { nombre } });
    if (existing) {
      throw new BadRequestException(`El método de pago '${nombre}' ya existe.`);
    }

    const metodoPago = this.metodoPagoRepository.create(createMetodoPagoDto);
    return this.metodoPagoRepository.save(metodoPago);
  }

  async findAll(): Promise<MetodoPago[]> {
    return this.metodoPagoRepository.find();
    // Si necesitas paginación, aquí usarías .findAndCount o QueryBuilder.
    // Para catálogos pequeños, find() es suficiente.
  }

  async findOne(id: number): Promise<MetodoPago> {
    const metodoPago = await this.metodoPagoRepository.findOne({ where: { id } });
    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado.`);
    }
    return metodoPago;
  }

  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    // 1. Verificar si existe
    const metodoPago = await this.metodoPagoRepository.findOne({ where: { id } });
    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado.`);
    }

    // 2. Verificar unicidad si se cambia el nombre
    if (updateMetodoPagoDto.nombre && updateMetodoPagoDto.nombre !== metodoPago.nombre) {
      const existing = await this.metodoPagoRepository.findOne({ where: { nombre: updateMetodoPagoDto.nombre } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`El método de pago '${updateMetodoPagoDto.nombre}' ya existe.`);
      }
    }

    // 3. Aplicar y guardar cambios
    this.metodoPagoRepository.merge(metodoPago, updateMetodoPagoDto);
    return this.metodoPagoRepository.save(metodoPago);
  }

 

  async remove(id: number): Promise<void> { 
    const result = await this.metodoPagoRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado.`);
    }
  }
}