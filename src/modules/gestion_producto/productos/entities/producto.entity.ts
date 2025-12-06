// src/modulos/gestion_producto/productos/entities/producto.entity.ts

import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Estado } from '../../../catalogos_basicos/estados/entities/estado.entity';
import { Precio } from '../../precios/entities/precio.entity';
import { Compra } from '../../compras/entities/compra.entity';
import { Subcategoria } from '../../../catalogos_basicos/subcategorias/entities/subcategoria.entity';
@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 50, unique: true })
  codigo: string;

  // ✅ Costo de compra
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precio_costo: number; 

  // ✅ Precio de venta (expuesto al frontend)
  @Column('decimal', { precision: 10, scale: 2, default: 0, name: 'precio_venta' })
  precio_venta: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ficha_tecnica_url?: string;

  // URL de imagen principal
  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen_url?: string;

  // URL opcional para PDF adicional
  @Column({ type: 'varchar', length: 255, nullable: true })
  pdf_url?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // ESTADO
  @Column({ name: 'estado_id', type: 'int', default: 1 })
  estadoId: number;

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  // 🛑 CAMBIO CRÍTICO: RELACIÓN CON SUBCATEGORÍA (Nivel 3)
  // -----------------------------------------------------
  // La columna fue renombrada a `subcategoria_id` en la base de datos (paso anterior).
  @Column({ name: 'subcategoria_id', type: 'int' })
  subcategoriaId: number; 

  // Apunta a la entidad Subcategoria
  @ManyToOne(() => Subcategoria, { eager: true })
  @JoinColumn({ name: 'subcategoria_id' }) // Debe coincidir con el nombre de la columna en la BD
  subcategoria: Subcategoria; // El nombre de la propiedad cambia a 'subcategoria'
  
  // -----------------------------------------------------

  // RELACIONES
  // Un producto tiene un único registro de inventario (one-to-one).
  @OneToOne(() => Inventario, (inv) => inv.producto)
  inventario: Inventario;

  @OneToMany(() => Precio, (precio) => precio.producto)
  precios: Precio[];

  // Relación con compras (un producto puede tener muchas compras)
  @OneToMany(() => Compra, (compra) => compra.producto)
  compras: Compra[];
}