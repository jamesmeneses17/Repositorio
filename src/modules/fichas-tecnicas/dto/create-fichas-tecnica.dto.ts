import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFichaTecnicaDto {
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsString()
  @IsNotEmpty({ message: 'El archivo_url es obligatorio' })
  @MaxLength(255, { message: 'El archivo_url no puede superar los 255 caracteres' })
  archivo_url: string;
}
