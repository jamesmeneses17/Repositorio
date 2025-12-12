# Cambios en la Gestión de Imágenes de Productos

## Resumen
Se ha actualizado la estructura del backend para eliminar la propiedad `imagen_url` del modelo de Producto y migrar toda la gestión de imágenes a través de una tabla separada `producto_imagenes` con relación uno a muchos.

## Cambios Realizados

### 1. **Actualización del DTO de Creación** 
📁 `src/modules/gestion_producto/productos/dto/create-producto.dto.ts`

- ❌ **Eliminado:** Campo `imagen_url` del DTO
- ✅ Se mantiene: `ficha_tecnica_url` (para documentos PDF/fichas técnicas)

```typescript
// ANTES:
@IsOptional()
@IsString()
imagen_url?: string;

// DESPUÉS: (Eliminado)
```

### 2. **Actualización de la Entidad Producto**
📁 `src/modules/gestion_producto/productos/entities/producto.entity.ts`

- ✅ La entidad ya contiene la relación `OneToMany` con `ProductoImagen`
- La propiedad `imagen_url` nunca fue una columna en la entidad (solo en el DTO)

```typescript
@OneToMany(() => ProductoImagen, (imagen) => imagen.producto, { cascade: true })
imagenes: ProductoImagen[];
```

### 3. **Actualización del Servicio de Productos**
📁 `src/modules/gestion_producto/productos/productos.service.ts`

#### Cambios:
- ✅ **Agregado:** Inyección de `ProductoImagenRepository`
- ✅ **Agregado:** Nuevo método `saveImage()` para guardar imágenes en `producto_imagenes`
- ✅ **Actualizado:** Método `findOneWithRelations()` para incluir JOIN con tabla `producto_imagenes`

#### Nuevo Método:
```typescript
async saveImage(productoId: number, urlImagen: string, orden?: number): Promise<ProductoImagen> {
  // Valida que el producto existe
  // Calcula automáticamente el orden si no se proporciona
  // Guarda la imagen en la tabla producto_imagenes
  // Retorna el registro creado
}
```

#### Cambio en Query:
```typescript
// Antes de: Solo se cargaba el producto
const producto = await this.productosRepo.createQueryBuilder('producto')
  .leftJoinAndSelect('producto.precios', 'precios')
  // ...
  .getOne();

// Ahora: Se incluye JOIN con producto_imagenes
.leftJoinAndSelect('producto.imagenes', 'imagenes')
.addOrderBy('imagenes.orden', 'ASC')
```

### 4. **Actualización del Controlador de Productos**
📁 `src/modules/gestion_producto/productos/productos.controller.ts`

#### Cambio en Endpoint `POST /productos/:id/upload-imagen`

**Antes:**
```typescript
// Guardaba imagen_url directamente en la tabla productos
const payload = {};
if (t === 'imagen') payload.imagen_url = url;
const updated = await this.productosService.update(+id, payload);
```

**Después:**
```typescript
if (t === 'imagen') {
  // Guardar imagen en tabla producto_imagenes
  const imagen = await this.productosService.saveImage(+id, url);
  const producto = await this.productosService.findOneWithRelaciones(+id);
  return { imagen, producto };
} else {
  // Guardar ficha_tecnica_url en tabla productos (sin cambios)
  const updated = await this.productosService.update(+id, { ficha_tecnica_url: url });
  return { ficha_tecnica_url: url, producto: updated };
}
```

### 5. **Migración de Base de Datos**
📁 `src/migrations/20251211RemoveImagenUrlFromProductos.ts`

```typescript
// UP: Elimina la columna imagen_url de la tabla productos
ALTER TABLE `productos` DROP COLUMN `imagen_url`;

// DOWN: Restaura la columna en caso de rollback
ALTER TABLE `productos` ADD COLUMN `imagen_url` varchar(255) NULL;
```

## Estructura de Datos

### Tabla `producto_imagenes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria (autoincrement) |
| producto_id | INT | Clave foránea hacia `productos.id` (ON DELETE CASCADE) |
| url_imagen | VARCHAR(500) | URL de la imagen almacenada en R2 |
| orden | INT | Índice numérico para definir el orden de visualización |

## Impacto en los Endpoints

### GET `/productos` (Lista con Paginación)
- ✅ Ahora incluye las imágenes en la relación `imagenes` con JOIN
- Las imágenes se traen ordenadas por `orden ASC`

### GET `/productos/:id` (Detalle)
- ✅ Ahora trae todas las imágenes del producto en el array `imagenes`
- Las imágenes se ordenan automáticamente por campo `orden`

### POST `/productos/:id/upload-imagen` (Carga de Imagen)
- ✅ Ahora guarda en la tabla `producto_imagenes` en lugar de actualizar `imagen_url`
- Calcula automáticamente el `orden` basado en la cantidad de imágenes existentes
- **Response:**
  ```json
  {
    "imagen": {
      "id": 123,
      "producto_id": 45,
      "url_imagen": "https://r2.example.com/...",
      "orden": 0
    },
    "producto": { ... }
  }
  ```

### POST `/productos` (Crear Producto)
- ✅ El DTO ya no acepta `imagen_url`
- Las imágenes se deben cargar **después** de crear el producto usando el endpoint `/productos/:id/upload-imagen`

### PATCH `/productos/:id` (Actualizar Producto)
- ✅ El DTO ya no acepta `imagen_url`
- No es posible actualizar imágenes a través de este endpoint

## Consideraciones Importantes

1. **Migración de datos existentes:** Si ya hay productos con `imagen_url` en la BD, estos datos se perderán al ejecutar la migración `up()`. Si necesitas preservar esas imágenes:
   - Crea una migración intermedia que copie los datos de `imagen_url` a `producto_imagenes` antes de eliminar la columna

2. **Orden de imágenes:** El sistema maneja automáticamente el `orden`, pero puedes especificarlo al llamar a `saveImage(productoId, url, orden)`

3. **Compatibilidad del Frontend:** 
   - El frontend debe ser actualizado para:
     - No enviar `imagen_url` en la creación/edición de productos
     - Usar el endpoint `/productos/:id/upload-imagen` para cargar imágenes
     - Acceder a las imágenes desde `producto.imagenes[...]` en lugar de `producto.imagen_url`

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `dto/create-producto.dto.ts` | Eliminado campo `imagen_url` |
| `productos.service.ts` | Agregado `ProductoImagenRepository`, método `saveImage()`, JOIN con imágenes en queries |
| `productos.controller.ts` | Actualizado endpoint `upload-imagen` para guardar en `ProductoImagen` |
| `migrations/20251211RemoveImagenUrlFromProductos.ts` | Nueva migración para eliminar columna |

## Próximos Pasos

1. ✅ Ejecutar la migración: `npm run typeorm migration:run`
2. 🔄 Actualizar el frontend para reflejar los cambios en los endpoints
3. 📋 Probar los endpoints de carga de imágenes
4. 🗑️ (Opcional) Migrar datos históricos si es necesario
