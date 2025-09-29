import { Injectable } from '@nestjs/common';
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
      throw new Error(`Precio with id ${id} not found`);
    }
    return this.precioRepository.remove(precio);
  }

  // Métodos adicionales para obtener relaciones cuando sea necesario
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
}
