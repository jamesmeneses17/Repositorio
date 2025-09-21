import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('subcategorias')
export class Subcategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.subcategorias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}
