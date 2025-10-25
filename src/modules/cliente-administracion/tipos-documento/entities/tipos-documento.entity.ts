// src/tipos-documento/entities/tipo-documento.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity'; 

@Entity('tipos_documento') // Nombre de la tabla en la DB
export class TipoDocumento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nombre: string;
  
  // Puedes añadir otros campos si existen (ej: código, descripción)

  // Relación OneToMany: Un tipo de documento puede tener muchos clientes
  @OneToMany(() => Cliente, cliente => cliente.tipo_documento_id)
  clientes: Cliente[];
}