// src/modules/configuracion_web/banners/dto/update-banner.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateBannerDto } from './create-banner.dto';
import { 
    IsString, IsNotEmpty, IsUrl, IsOptional, IsInt, IsBoolean, MaxLength 
} from 'class-validator';

/**
 * DTO para actualizar un Banner. 
 * Todos los campos de CreateBannerDto son opcionales.
 */
export class UpdateBannerDto {
    
    // Al usar PartialType de NestJS:
    // export class UpdateBannerDto extends PartialType(CreateBannerDto) {}

    // Si no usas NestJS (estructura manual):
    @IsString()
    @IsOptional()
    @MaxLength(150)
    titulo?: string;

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
    @IsOptional()
    @MaxLength(255)
    urlImagen?: string; 

    @IsInt()
    @IsOptional()
    orden?: number; 
    
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}