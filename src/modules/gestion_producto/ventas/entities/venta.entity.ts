import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity'; // Ajusta la ruta a tu entidad Producto

@Entity('ventas') // El nombre de la tabla en tu base de datos es 'ventas'
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  // --- Relación de Clave Foránea con Producto ---

  @Column({ name: 'producto_id' }) // Columna que almacena el ID
  productoId: number;

  @ManyToOne(() => Producto) // Define la relación con la entidad Producto
  @JoinColumn({ name: 'producto_id' }) // Especifica la columna de la relación
  producto: Producto;

  // ---------------------------------------------

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  costo_unitario: number; // Mapea al campo DECIMAL(12,2)

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_venta: number; // Mapea al campo DECIMAL(12,2)
}