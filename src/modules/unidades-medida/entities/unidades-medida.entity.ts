import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('unidades_medida')
@Unique(['nombre'])
@Unique(['abreviatura'])
export class UnidadMedida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 10 })
  abreviatura: string;

  // Relación con productos
  @OneToMany(() => Producto, (producto) => producto.unidadMedida)
  productos: Producto[];
}
