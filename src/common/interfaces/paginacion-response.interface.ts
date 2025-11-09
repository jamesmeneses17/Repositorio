// src/common/interfaces/paginacion-response.interface.ts

export interface PaginacionResponse<T> {
    data: T[]; // El array de entidades (ej: PrecioConProductoCalculadoDto)
    total: number; // El total de registros en la base de datos (sin el límite de la página)
}