import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('subcategorias')
export class Subcategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ManyToOne(() => Categoria, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}
