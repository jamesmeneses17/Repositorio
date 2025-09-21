import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('especificaciones_tecnicas')
export class EspecificacionesTecnicas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  // Relación con productos
  @OneToMany(() => Producto, (producto) => producto.especificacionesTecnicas)
  productos: Producto[];
}
