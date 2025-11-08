// src/modulos/gestion_producto/precios/dto/create-precio.dto.ts

import { 
    IsInt, 
    IsNumber, 
    IsPositive, 
    IsOptional, 
    IsString, 
    Min, 
    Max, 
    IsDateString, 
    IsBoolean 
} from 'class-validator';

export class CreatePrecioDto {
    // ID del producto al que se aplica el precio
    @IsInt({ message: 'El ID del producto debe ser un número entero.' })
    @IsPositive({ message: 'El ID del producto debe ser positivo.' })
    productoId: number;

    // Precio base
    @IsNumber({}, { message: 'El valor unitario debe ser un número.' })
    @IsPositive({ message: 'El valor unitario debe ser positivo.' })
    valor_unitario: number;

    // Descuento en porcentaje
    @IsNumber({}, { message: 'El descuento debe ser un número.' })
    @Min(0, { message: 'El descuento mínimo es 0.' })
    @Max(100, { message: 'El descuento máximo es 100.' })
    @IsOptional()
    descuento_porcentaje?: number; 

    // Indicador de promoción (El formulario de precios no lo usa directamente, pero lo necesita la DB)
    @IsBoolean({ message: 'El indicador de promoción debe ser booleano.' })
    @IsOptional()
    en_promocion?: boolean; // Se puede calcular en el servicio si descuento > 0

    // Fecha de inicio de vigencia
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida (YYYY-MM-DD).' })
    fecha_inicio: string;

    // Fecha de fin de vigencia (opcional)
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida (YYYY-MM-DD).' })
    fecha_fin?: string | null;
}