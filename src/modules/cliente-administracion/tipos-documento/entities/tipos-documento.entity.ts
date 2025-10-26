
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity'; 

@Entity('tipos_documento') 
export class TipoDocumento {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    nombre: string;
    
    @OneToMany(() => Cliente, cliente => cliente.tipoDocumento) 
    clientes: Cliente[];
}