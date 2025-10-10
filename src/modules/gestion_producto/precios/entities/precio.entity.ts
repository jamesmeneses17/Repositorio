// En tu backend NestJS, el archivo de la entidad Precio

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; 
import { Producto } from '../../productos/entities/producto.entity'; 

@Entity('precios')
export class Precio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    valor_unitario: number;

    @Column({ type: 'date' })
    fecha_inicio: string;

    @Column({ type: 'date', nullable: true })
    fecha_fin: string | null;

    @Column({ name: 'producto_id', type: 'int' })
    productoId: number; 

    @ManyToOne(() => Producto, (producto) => producto.precios)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto; 
}