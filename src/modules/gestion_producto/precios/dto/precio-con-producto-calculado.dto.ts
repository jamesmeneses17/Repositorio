// src/modulos/gestion_producto/precios/dto/precio-con-producto-calculado.dto.ts

import { Precio } from '../entities/precio.entity';
import { Producto } from '../../productos/entities/producto.entity'; 

// Usamos Omit para excluir la propiedad 'producto' de la entidad Precio
// y luego la redefinimos con el tipo que TypeORM proporciona (que es lo que el servicio cargará).
// NOTA: Para este caso, lo más limpio es simplemente NO EXTENDER la entidad directamente,
// sino definir el objeto de respuesta esperado.

export class PrecioConProductoCalculadoDto {
    // Propiedades de la Entidad Precio que se incluyen (opcionalmente)
    id: number;
    valor_unitario: number; 
    descuento: number;
    en_promocion: boolean;
    fecha_inicio: string;
    fecha_fin: string | null;
    productoId: number; 

    // ✅ Propiedad 'producto' (Relación - NO REDEFINIR si se usa PartialType)
    // Ya que eliminamos PartialType/herencia directa, la definimos aquí:
    producto: Partial<Producto>; 
    
    // 💡 Campos calculados y renombrados para el frontend
    costo: number; 
    precioBase: number; 
    precioFinal: number; 
    estado: 'Normal' | 'En Promoción' | 'Vencido'; 
}

/**
 * Interfaz de respuesta de paginación que utiliza el DTO calculado.
 */
export interface PaginacionResponsePrecio {
    data: PrecioConProductoCalculadoDto[];
    total: number;
}