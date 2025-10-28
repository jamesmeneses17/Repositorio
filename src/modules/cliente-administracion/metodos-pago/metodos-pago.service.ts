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
    const nombreNormalizado = createMetodoPagoDto.nombre.trim();


    const existing = await this.metodoPagoRepository.findOne({
      where: { nombre: nombreNormalizado }
    });


    if (existing) {
      throw new BadRequestException(`El método de pago '${nombreNormalizado}' ya existe.`);
    }

    // 3️⃣ Creamos y guardamos con el nombre limpio
    const metodoPago = this.metodoPagoRepository.create({ nombre: nombreNormalizado });
    const saved = await this.metodoPagoRepository.save(metodoPago);
    return saved;
  }

  // 🔍 OBTENER TODOS
  async findAll(): Promise<MetodoPago[]> {
    return this.metodoPagoRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  // 🔍 OBTENER UNO
  async findOne(id: number): Promise<MetodoPago> {
    const metodoPago = await this.metodoPagoRepository.findOne({ where: { id } });
    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado.`);
    }
    return metodoPago;
  }

  // ✏️ ACTUALIZAR
  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    const metodoPago = await this.metodoPagoRepository.findOne({ where: { id } });
    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado.`);
    }

    // Si cambia el nombre, verificamos duplicado
    if (updateMetodoPagoDto.nombre) {
      const nombreNormalizado = updateMetodoPagoDto.nombre.trim();

      const existing = await this.metodoPagoRepository
        .createQueryBuilder('m')
        .where('LOWER(TRIM(m.nombre)) = LOWER(:nombre)', { nombre: nombreNormalizado })
        .andWhere('m.id != :id', { id })
        .getOne();

      if (existing) {
        throw new BadRequestException(`El método de pago '${nombreNormalizado}' ya existe.`);
      }

      metodoPago.nombre = nombreNormalizado;
    }

    return await this.metodoPagoRepository.save(metodoPago);
  }

  // 🗑️ ELIMINAR
  async remove(id: number): Promise<void> {
    const result = await this.metodoPagoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado.`);
    }
  }
}
