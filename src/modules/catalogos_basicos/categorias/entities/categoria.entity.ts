import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Estado } from '../../estados/entities/estado.entity';
import { Compra } from '../../../gestion_producto/compras/entities/compra.entity';
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

    // Relación inversa con compras (una categoría puede agrupar muchas compras)
    @OneToMany(() => Compra, (compra) => compra.categoria)
    compras: Compra[];
    
    @OneToMany(() => Producto, (producto) => producto.categoria)
productos: Producto[];

}