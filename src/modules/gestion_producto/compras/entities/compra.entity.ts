import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('compras')
export class Compra {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'date' })
    fecha: string;

    // ========================
    //     RELACIÓN PRODUCTO
    // ========================
    @Column({ name: 'producto_id' })
    productoId: number;

    @ManyToOne(() => Producto, (producto) => producto.compras, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    // ========================
    //     RELACIÓN CATEGORÍA
    // ========================
    // Mantener solo la columna categoria_id (sin relación) para mantener compatibilidad con la BD.
    // Se llena automáticamente en el backend a partir del producto si no viene desde el front.
    @Column({ name: 'categoria_id', type: 'int', nullable: true })
    categoriaId?: number;

    // ========================
    //     CAMPOS PROPIOS
    // ========================
    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    costo_unitario: number;
}
