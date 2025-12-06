
export class InformacionEmpresa {
    
    // CAMPOS DE ORM (simulados)
    // @PrimaryGeneratedColumn() 
    id: number; 

    // DATOS IDENTIFICATIVOS
    // @Column({ type: 'varchar', length: 100, nullable: false })
    nombreEmpresa: string;
    
    // @Column({ type: 'varchar', length: 100, nullable: true })
    razonSocial?: string;
    
    // @Column({ type: 'varchar', length: 50, nullable: true })
    nit?: string; // Campo opcional que puede ser útil

    
    // DATOS DE CONTACTO
    // @Column({ type: 'varchar', length: 50, nullable: false })
    telefonoFijo: string;

    // @Column({ type: 'varchar', length: 50, nullable: false })
    whatsapp: string; 

    // @Column({ type: 'varchar', length: 100, nullable: false })
    emailInfo: string; 

    // @Column({ type: 'varchar', length: 100, nullable: true })
    emailVentas?: string;


    // UBICACIÓN PRINCIPAL
    // @Column({ type: 'varchar', length: 255, nullable: false })
    direccionPrincipal: string; 


    // HORARIOS DE ATENCIÓN
    // @Column({ type: 'varchar', length: 100, nullable: false })
    horarioLunesViernes: string; 
    
    // @Column({ type: 'varchar', length: 100, nullable: false })
    horarioSabados: string; 
    
    // @Column({ type: 'varchar', length: 100, nullable: false })
    horarioDomingos: string; 


    // REDES SOCIALES (URLs)
    // @Column({ type: 'varchar', length: 255, nullable: true })
    urlFacebook?: string;
    
    // @Column({ type: 'varchar', length: 255, nullable: true })
    urlInstagram?: string;
    
    // @Column({ type: 'varchar', length: 255, nullable: true })
    urlLinkedIn?: string;

    // IMÁGENES y LOGOS (Se almacenan como URLs)
    // @Column({ type: 'varchar', length: 255, nullable: false })
    urlLogo: string; 
    
    // @Column({ type: 'varchar', length: 255, nullable: true })
    urlFavicon?: string;
    
    // CONTROL DE AUDITORÍA (Opcional, pero recomendado)
    // @CreateDateColumn()
    createdAt: Date;
    
    // @UpdateDateColumn()
    updatedAt: Date;
}