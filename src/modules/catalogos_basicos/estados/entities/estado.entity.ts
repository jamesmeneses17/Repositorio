import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../../gestion_producto/productos/entities/producto.entity';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
  
  @OneToMany(() => Producto, (producto) => producto.estado)
productos: Producto[];

}