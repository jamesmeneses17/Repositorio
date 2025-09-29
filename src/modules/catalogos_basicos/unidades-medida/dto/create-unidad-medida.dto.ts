import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUnidadMedidaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
