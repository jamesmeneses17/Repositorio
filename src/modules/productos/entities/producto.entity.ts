import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Marca } from '../../marcas/entities/marca.entity';
import { Subcategoria } from '../../subcategorias/entities/subcategoria.entity';
import { UnidadMedida } from '../../unidades-medida/entities/unidades-medida.entity';
import { FichaTecnica } from '../../fichas-tecnicas/entities/fichas-tecnica.entity';
import { EspecificacionesTecnicas } from '../../especificaciones-tecnicas/entities/especificaciones-tecnica.entity';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Subcategoria, (subcategoria) => subcategoria.productos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subcategoria_id' })
    subcategoria: Subcategoria;

    @ManyToOne(() => Marca, (marca) => marca.productos, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'marca_id' })
    marca: Marca;

    @ManyToOne(() => UnidadMedida, (unidad) => unidad.productos, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'unidad_medida_id' })
    unidadMedida: UnidadMedida;

    @Column({ type: 'varchar', length: 150 })
    nombre: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    codigo: string;
    
    @ManyToOne(() => EspecificacionesTecnicas, (esp) => esp.productos, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'especificaciones_tecnicas_id' })
    especificacionesTecnicas?: EspecificacionesTecnicas;


    @Column({ type: 'decimal', precision: 12, scale: 2 })
    valorUnitario: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    imagenUrl?: string;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @ManyToOne(() => FichaTecnica, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'ficha_tecnica_id' })
    fichaTecnica?: FichaTecnica;

    @Column({ type: 'boolean', default: false })
    enPromocion: boolean;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    descuento: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaCreacion: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    fechaActualizacion: Date;
}
