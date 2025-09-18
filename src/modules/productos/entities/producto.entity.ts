import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'boolean', default: true })
    estado: boolean;

    @ManyToOne(() => Categoria, (categoria) => categoria.id, { eager: true })
    categoria: Categoria;
}
