import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Categoria } from '../../../catalogos_basicos/categorias/entities/categoria.entity';

@Entity('compras')
export class Compra {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    codigo: string;

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
    @Column({ name: 'categoria_id' })
    categoriaId: number;

    @ManyToOne(() => Categoria, (categoria) => categoria.compras, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    // ========================
    //     CAMPOS PROPIOS
    // ========================
    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    costo_unitario: number;
}
