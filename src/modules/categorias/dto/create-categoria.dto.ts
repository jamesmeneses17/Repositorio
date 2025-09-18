import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;
}
