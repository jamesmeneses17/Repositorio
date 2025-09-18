import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('categorias')
@Unique(['nombre'])
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ type: 'boolean', default: true })
    estado: boolean;
}
