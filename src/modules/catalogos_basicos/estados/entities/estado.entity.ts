import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}