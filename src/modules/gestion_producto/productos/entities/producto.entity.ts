// productos/entities/producto.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Estado } from '../../../catalogos_basicos/estados/entities/estado.entity';
import { Precio } from '../../precios/entities/precio.entity';
import { Categoria } from '../../../catalogos_basicos/categorias/entities/categoria.entity'; // 👈 Asegúrate de que esta ruta sea correcta

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ficha_tecnica_url?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // ESTADO
  @Column({ name: 'estado_id', type: 'int', default: 1 })
  estadoId: number;

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  // ✅ CATEGORÍA: Nueva relación directa
  @Column({ name: 'categoria_id', type: 'int' })
  categoriaId: number; // Mapea la columna categoria_id de tu tabla productos

  @ManyToOne(() => Categoria, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  // RELACIONES
  // 🛑 Eliminamos OneToMany a ProductoCaracteristica si ya no existe/se usa.

  @OneToMany(() => Inventario, (inv) => inv.producto)
  inventario: Inventario[];

  @OneToMany(() => Precio, (precio) => precio.producto)
  precios: Precio[];
}