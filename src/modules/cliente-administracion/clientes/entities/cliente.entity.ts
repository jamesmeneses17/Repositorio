// src/clientes/entities/cliente.entity.ts (Actualizado)

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoDocumento } from '../../tipos-documento/entities/tipos-documento.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  // Clave foránea al Tipo de Documento
  @Column({ name: 'tipo_documento_id' })
  tipo_documento_id: number; 

  @Column({ length: 20, unique: true })
  numero_documento: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ length: 100, nullable: true })
  correo: string;

  @Column({ length: 15, nullable: true })
  telefono: string;

  // RELACIÓN MANY TO ONE
  // Un cliente tiene un TipoDocumento
  @ManyToOne(() => TipoDocumento, tipoDocumento => tipoDocumento.clientes)
  @JoinColumn({ name: 'tipo_documento_id' }) // Especificamos la columna de unión
  tipoDocumento: TipoDocumento;
}