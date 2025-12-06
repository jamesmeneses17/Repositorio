// src/modules/configuracion_web/banners/entities/banner.entity.ts

/**
 * Entidad que almacena la información de cada Banner o diapositiva del carrusel.
 */
export class Banner {
    
    // CAMPOS DE ORM (simulados)
    // @PrimaryGeneratedColumn() 
    id: number; 

    // CONTENIDO
    // @Column({ type: 'varchar', length: 150, nullable: false })
    titulo: string;
    
    // @Column({ type: 'varchar', length: 255, nullable: true })
    subtitulo?: string;

    // ACCIÓN
    // @Column({ type: 'varchar', length: 255, nullable: true })
    urlLink?: string; // Hacia dónde redirige el botón (ej. /productos/ofertas)
    
    // @Column({ type: 'varchar', length: 50, nullable: true })
    textoBoton?: string;

    // MEDIA
    // @Column({ type: 'varchar', length: 255, nullable: false })
    urlImagen: string; // URL donde está alojada la imagen del banner

    // CONFIGURACIÓN Y ORDEN
    // @Column({ type: 'int', default: 0 })
    orden: number; // El orden en que se mostrarán en el carrusel
    
    // @Column({ type: 'boolean', default: true })
    activo: boolean; // Si el banner debe mostrarse o no

    // CONTROL DE AUDITORÍA
    // @CreateDateColumn()
    createdAt: Date;
    
    // @UpdateDateColumn()
    updatedAt: Date;
}