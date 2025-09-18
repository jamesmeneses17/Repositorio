import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsNumber()
    @IsPositive({ message: 'El precio debe ser mayor a 0' })
    precio: number;

    @IsInt()
    @Min(0, { message: 'El stock no puede ser negativo' })
    stock: number;

    @IsInt()
    @IsNotEmpty({ message: 'Debe indicar la categoría' })
    categoriaId: number;
}
