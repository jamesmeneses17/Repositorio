import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
