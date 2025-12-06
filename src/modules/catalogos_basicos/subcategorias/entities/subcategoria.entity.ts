// subcategorias/entities/subcategoria.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Producto } from '../../../gestion_producto/productos/entities/producto.entity';

@Entity('subcategorias')
export class Subcategoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    nombre: string;

    @Column({ name: 'categoria_id', type: 'int' })
    categoriaId: number;

    @ManyToOne(() => Categoria, { eager: true })
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    @OneToMany(() => Producto, (producto) => producto.subcategoria)
    productos: Producto[];
}