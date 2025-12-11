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

    /** Estado activo (1) o inactivo (0). @example 1 */
    activo?: number;

    /** URL de la imagen de la subcategoría. @example "https://example.com/image.jpg" */
    imagen_url?: string;
}