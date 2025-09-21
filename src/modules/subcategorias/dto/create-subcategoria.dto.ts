import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubcategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt({ message: 'Debe indicar una categoría válida' })
  categoriaId: number;
}
