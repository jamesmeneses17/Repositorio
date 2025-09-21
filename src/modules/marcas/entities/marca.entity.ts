import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('marcas')
@Unique(['nombre'])
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // Relación con productos
  @OneToMany(() => Producto, (producto) => producto.marca)
  productos: Producto[];
}
