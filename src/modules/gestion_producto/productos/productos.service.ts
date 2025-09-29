import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepo.create(dto);
    return this.productosRepo.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepo.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepo.findOne({
      where: { id },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, dto);
    return this.productosRepo.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productosRepo.remove(producto);
  }

  // Métodos adicionales para obtener relaciones cuando sea necesario
  async findAllWithRelations(): Promise<Producto[]> {
    return this.productosRepo.find({
      relations: ['caracteristicas', 'precios', 'inventario'],
    });
  }

  async findOneWithRelations(id: number): Promise<Producto> {
    const producto = await this.productosRepo.findOne({
      where: { id },
      relations: ['caracteristicas', 'precios', 'inventario'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto with ID ${id} not found`);
    }
    return producto;
  }
}
