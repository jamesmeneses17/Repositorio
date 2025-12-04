import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaPrincipalDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
