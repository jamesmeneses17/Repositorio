import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { ProductoCaracteristica } from '../../productos-caracteristicas/entities/productos-caracteristica.entity';
import { Estado } from '../../../catalogos_basicos/estados/entities/estado.entity';
@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ficha_tecnica_url?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // ESTADO
  @Column({ name: 'estado_id', type: 'int', default: 1 })
  estadoId: number;

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado; 

  // RELACIONES
  @OneToMany(() => ProductoCaracteristica, (caracteristica) => caracteristica.producto)
  caracteristicas: ProductoCaracteristica[];

  @OneToMany(() => Inventario, (inv) => inv.producto)
  inventario: Inventario[];

  // @OneToMany(() => FacturaDetalle, (detalle) => detalle.producto)
  // facturasDetalle: FacturaDetalle[];
}