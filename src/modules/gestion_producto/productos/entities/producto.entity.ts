import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { ProductoCaracteristica } from '../../productos-caracteristicas/entities/productos-caracteristica.entity';

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

  // 🔗 Relaciones
  @OneToMany(() => ProductoCaracteristica, (caracteristica) => caracteristica.producto)
  caracteristicas: ProductoCaracteristica[];

  @OneToMany(() => Inventario, (inv) => inv.producto)
  inventario: Inventario[];

  // TODO: Verificar si existe FacturaDetalle o crear la entidad
  // @OneToMany(() => FacturaDetalle, (detalle) => detalle.producto)
  // facturasDetalle: FacturaDetalle[];
}
