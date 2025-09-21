import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUnidadMedidaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 10)
    abreviatura: string;
}
