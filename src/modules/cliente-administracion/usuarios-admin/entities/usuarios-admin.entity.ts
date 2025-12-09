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

    @Column({ nullable: true })
    reset_password_token: string;

    @Column({ type: 'datetime', nullable: true })
    reset_password_expires: Date;
}
