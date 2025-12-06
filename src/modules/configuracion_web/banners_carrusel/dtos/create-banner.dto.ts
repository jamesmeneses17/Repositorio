// src/modules/configuracion_web/banners/dto/create-banner.dto.ts

import { IsString, IsNotEmpty, IsUrl, IsOptional, IsInt, IsBoolean, MaxLength } from 'class-validator';

export class CreateBannerDto {
  
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    titulo: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    subtitulo?: string;

    @IsUrl()
    @IsOptional()
    @MaxLength(255)
    urlLink?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    textoBoton?: string;

    @IsUrl()
    @IsNotEmpty()
    @MaxLength(255)
    urlImagen: string; // URL obligatoria

    @IsInt()
    @IsOptional()
    orden?: number; 
    
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}