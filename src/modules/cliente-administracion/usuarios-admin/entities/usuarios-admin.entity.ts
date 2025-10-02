import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuarios_admin')
export class UsuarioAdmin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    correo: string;

    @Column()
    contrasena: string;

    @Column()
    rol: string;

    @CreateDateColumn()
    fecha_creacion: Date;
}
