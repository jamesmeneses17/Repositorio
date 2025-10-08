import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Estado } from '../../estados/entities/estado.entity';

@Entity('subcategorias')
export class Subcategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'estado_id', type: 'int', default: 1 })
  estadoId: number;

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @ManyToOne(() => Categoria, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}