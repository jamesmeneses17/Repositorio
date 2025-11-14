// src/modulos/gestion_producto/productos/entities/producto.entity.ts

import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Estado } from '../../../catalogos_basicos/estados/entities/estado.entity';
import { Precio } from '../../precios/entities/precio.entity';
import { Categoria } from '../../../catalogos_basicos/categorias/entities/categoria.entity'; 

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 50, unique: true })
  codigo: string;

  // ✅ CAMPO AGREGADO: Costo de compra (Precio que la empresa paga al proveedor)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precio_costo: number; 

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

  // ✅ CATEGORÍA
  @Column({ name: 'categoria_id', type: 'int' })
  categoriaId: number; 

  @ManyToOne(() => Categoria, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

	// RELACIONES
	// Un producto tiene un único registro de inventario (one-to-one).
	// La entidad `Inventario` es la que contiene la columna `producto_id` (lado propietario),
	// por eso aquí mantenemos la relación inversa sin JoinColumn.
	@OneToOne(() => Inventario, (inv) => inv.producto)
	inventario: Inventario;

  @OneToMany(() => Precio, (precio) => precio.producto)
  precios: Precio[];
}