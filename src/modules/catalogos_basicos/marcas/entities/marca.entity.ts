import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoCaracteristica } from '../../../gestion_producto/productos-caracteristicas/entities/productos-caracteristica.entity';

@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => ProductoCaracteristica, (caracteristica) => caracteristica.marca)
  productos_caracteristicas: ProductoCaracteristica[];
}
