import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuarios_admin')
export class UsuarioAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 100 })
  correo: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ default: 'admin', length: 20 })
  rol: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}
