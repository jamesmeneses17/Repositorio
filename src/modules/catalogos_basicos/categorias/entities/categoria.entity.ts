import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Estado } from '../../estados/entities/estado.entity';
import { Subcategoria } from '../../subcategorias/entities/subcategoria.entity';
import { CategoriaPrincipal } from '../../categorias-principales/entitiies/categoria-principal.entity';

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
