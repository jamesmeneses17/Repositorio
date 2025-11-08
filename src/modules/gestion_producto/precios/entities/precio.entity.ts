// src/modulos/gestion_producto/precios/entities/precio.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; 
import { Producto } from '../../productos/entities/producto.entity'; 

@Entity('precios')
export class Precio {
    @PrimaryGeneratedColumn()
    id: number;

    // Valor base del producto
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    valor_unitario: number;

    // Descuento en porcentaje (Ajustado según tu pantalla de DB)
    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    descuento: number;

    // Indicador de promoción (Ajustado según tu pantalla de DB)
    @Column({ type: 'boolean', default: false })
    en_promocion: boolean;

    @Column({ type: 'date' })
    fecha_inicio: string; // Usamos string para TypeORM de tipo 'date'

    @Column({ type: 'date', nullable: true })
    fecha_fin: string | null;

    // Clave foránea
    @Column({ name: 'producto_id', type: 'int' })
    productoId: number; 

    // Relación a Producto
    @ManyToOne(() => Producto, (producto) => producto.precios)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto; 
}