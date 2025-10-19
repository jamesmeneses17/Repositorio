import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) { }

  async create(dto: CreateMarcaDto) {
    // Validar que no exista una marca con el mismo nombre (case-insensitive)
    const nombre = dto.nombre.trim();
    const marcaExistente = await this.marcaRepository.findOne({ where: { nombre } });
    if (marcaExistente) {
      throw new ConflictException('Ya existe una marca con este nombre.');
    }

    const dataToSave = {
      ...dto,
      estadoId: dto.estadoId || 1,
    };
    const marca = this.marcaRepository.create(dataToSave);
    return this.marcaRepository.save(marca);
  }

  findAll() {
    return this.marcaRepository.find({
      where: { estadoId: 1 },
    });
  }

  async findOne(id: number) {
    const marca = await this.marcaRepository.findOne({
      where: { id },
    });
    if (!marca) throw new NotFoundException(`Marca con id ${id} no encontrada`);
    return marca;
  }

  async update(id: number, dto: UpdateMarcaDto) {
    const marca = await this.findOne(id);
    Object.assign(marca, dto);
    return this.marcaRepository.save(marca);
  }

  async remove(id: number) {
    const marca = await this.findOne(id);
    return this.marcaRepository.remove(marca);
  }

  findAllWithRelations() {
    return this.marcaRepository.find({
      relations: ['productos_caracteristicas'],
      where: { estadoId: 1 },
    });
  }

  async findOneWithRelations(id: number) {
    const marca = await this.marcaRepository.findOne({
      where: { id },
      relations: ['productos_caracteristicas'],
    });
    if (!marca) throw new NotFoundException(`Marca con id ${id} no encontrada`);
    return marca;
  }
}