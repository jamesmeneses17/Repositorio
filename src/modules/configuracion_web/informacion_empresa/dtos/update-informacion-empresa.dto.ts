// src/modules/configuracion_web/informacion_empresa/dto/update-informacion-empresa.dto.ts

import { IsString, IsOptional, IsEmail, IsUrl, MaxLength } from 'class-validator';
// Dependiendo de tu backend (NestJS), podrías extender un DTO base o usar PartialType:
// import { PartialType } from '@nestjs/mapped-types';
// export class UpdateInformacionEmpresaDto extends PartialType(CreateInformacionEmpresaDto) {}


/**
 * DTO utilizado para actualizar la información de la empresa.
 * Todos los campos son opcionales ya que solo se enviarán los datos a modificar.
 */
export class UpdateInformacionEmpresaDto {
  
  // DATOS DE EMPRESA
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombreEmpresa?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  razonSocial?: string;


  // DATOS DE CONTACTO
  @IsString()
  @IsOptional()
  @MaxLength(50)
  telefonoFijo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  whatsapp?: string; // Incluye el código de país (ej: +57 320...)

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  emailInfo?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  emailVentas?: string;


  // DATOS DE UBICACIÓN Y HORARIO
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccionPrincipal?: string; 

  @IsString()
  @IsOptional()
  @MaxLength(100)
  horarioLunesViernes?: string; 
  
  @IsString()
  @IsOptional()
  @MaxLength(100)
  horarioSabados?: string; 
  
  @IsString()
  @IsOptional()
  @MaxLength(100)
  horarioDomingos?: string; 


  // REDES SOCIALES (URLs)
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  urlFacebook?: string;
  
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  urlInstagram?: string;
  
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  urlLinkedIn?: string;


  // IMÁGENES (URLs de Cloudflare R2 u otro storage)
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  urlLogo?: string; 
  
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  urlFavicon?: string;
}