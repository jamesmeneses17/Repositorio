import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductoCaracteristica } from '../../../gestion_producto/productos-caracteristicas/entities/productos-caracteristica.entity';
import { Estado } from '../../estados/entities/estado.entity';

@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ name: 'estado_id', type: 'int', default: 1 })
  estadoId: number;

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @OneToMany(() => ProductoCaracteristica, (caracteristica) => caracteristica.marca)
  productos_caracteristicas: ProductoCaracteristica[];
}