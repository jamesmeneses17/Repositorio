import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Estado } from '../../estados/entities/estado.entity';
import { Producto } from '../../../gestion_producto/productos/entities/producto.entity';
@Entity('categorias')
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    nombre: string;
    
    @Column({ name: 'estado_id', type: 'int', default: 1 })
    estadoId: number; 

    @ManyToOne(() => Estado, { eager: true })
    @JoinColumn({ name: 'estado_id' })
    estado: Estado; 

    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos: Producto[];

}