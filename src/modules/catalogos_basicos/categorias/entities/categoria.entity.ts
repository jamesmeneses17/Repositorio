import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Subcategoria } from '../../subcategorias/entities/subcategoria.entity';
import { CategoriaPrincipal } from '../../categorias-principales/entitiies/categoria-principal.entity';

@Entity('categorias')
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    nombre: string;

    @Column({ type: 'tinyint', default: 1 })
    activo: number;

    @Column({ name: 'imagen_url', type: 'varchar', length: 500, nullable: true })
    imagenUrl: string | null;

    @OneToMany(() => Subcategoria, (subcategoria) => subcategoria.categoria)
    subcategorias: Subcategoria[];

    @Column({ name: 'categoria_principal_id', type: 'int', nullable: true })
    categoriaPrincipalId: number | null;

    @ManyToOne(() => CategoriaPrincipal, (cp) => cp.categorias, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'categoria_principal_id' })
    categoria_principal: CategoriaPrincipal;
}
