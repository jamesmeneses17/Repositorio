// subcategorias/dto/create-subcategoria.dto.ts

/**
 * DTO usado para crear una nueva subcategoría.
 * No incluye el 'id', ya que se genera automáticamente.
 */
export interface CreateSubcategoriaDto {
    /** @example "Auriculares Inalámbricos" */
    nombre: string;

    /** ID de la categoría padre (tabla 'categorias'). @example 5 */
    categoria_id: number;
}