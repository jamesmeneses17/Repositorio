import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Marca } from '../../../catalogos_basicos/marcas/entities/marca.entity';
import { UnidadMedida } from '../../../catalogos_basicos/unidades-medida/entities/unidad-medida.entity';
import { Especificacion } from '../../../catalogos_basicos/especificaciones/entities/especificacion.entity';


@Entity('producto_caracteristicas')
export class ProductoCaracteristica {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto, (producto) => producto.caracteristicas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Marca, { nullable: true })
  @JoinColumn({ name: 'marca_id' })
  marca: Marca;


  @ManyToOne(() => UnidadMedida, { nullable: true })
  @JoinColumn({ name: 'unidad_medida_id' })
  unidad_medida: UnidadMedida;

  @ManyToOne(() => Especificacion, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'especificacion_id' })
  especificacion: Especificacion;
}
