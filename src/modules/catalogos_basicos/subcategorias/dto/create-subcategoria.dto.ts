import { IsNotEmpty, IsString, MaxLength, IsInt } from 'class-validator';

export class CreateSubcategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsInt()
  @IsNotEmpty()
  categoriaId: number;
}
