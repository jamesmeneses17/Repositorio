// backend-ventas/src/gestion_producto/inventario/entities/inventario.entity.ts (ACTUALIZADO)

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('inventario')
export class Inventario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    // ❌ CAMPO ELIMINADO: 'stock_minimo'
    // Se elimina porque no existe en la BD y usaremos un umbral fijo en el servicio.

    @Column({ type: 'varchar', length: 100, nullable: true })
    ubicacion: string;

    @Column({ name: 'producto_id' })
    productoId: number;
    
    @OneToOne(() => Producto, (producto) => producto.inventario)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;
}