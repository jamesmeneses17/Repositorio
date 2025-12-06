// subcategorias/dto/update-subcategoria.dto.ts

import { CreateSubcategoriaDto } from './create-subcategoria.dto';

/**
 * DTO usado para actualizar una subcategoría.
 * Hereda los campos de creación y los hace opcionales (Partial).
 */
export interface UpdateSubcategoriaDto extends Partial<CreateSubcategoriaDto> {}