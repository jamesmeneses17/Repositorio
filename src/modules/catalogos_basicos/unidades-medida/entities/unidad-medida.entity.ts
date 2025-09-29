import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoCaracteristica } from '../../../gestion_producto/productos-caracteristicas/entities/productos-caracteristica.entity';

@Entity('unidades_medida')
export class UnidadMedida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => ProductoCaracteristica, (caracteristica) => caracteristica.unidad_medida)
  productos_caracteristicas: ProductoCaracteristica[];
}
