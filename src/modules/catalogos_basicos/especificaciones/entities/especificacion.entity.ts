import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('especificaciones')
export class Especificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
