// src/metodos-pago/entities/metodo-pago.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, MaxLength } from 'class-validator';

@Entity('metodos_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsString({ message: 'El nombre debe ser un texto.' })
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres.' })
  nombre: string;
}