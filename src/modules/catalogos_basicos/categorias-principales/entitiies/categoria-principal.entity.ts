import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('categorias_principales')
export class CategoriaPrincipal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @OneToMany(() => Categoria, (categoria) => categoria.categoria_principal)
  categorias: Categoria[];
}
