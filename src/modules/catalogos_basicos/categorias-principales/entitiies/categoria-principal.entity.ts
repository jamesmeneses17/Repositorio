import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('categorias_principales')
export class CategoriaPrincipal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'tinyint', default: 1 })
  activo: number;

  @Column({ name: 'imagen_url', type: 'varchar', length: 500, nullable: true })
  imagenUrl: string | null;

  @OneToMany(() => Categoria, (categoria) => categoria.categoria_principal)
  categorias: Categoria[];
}
