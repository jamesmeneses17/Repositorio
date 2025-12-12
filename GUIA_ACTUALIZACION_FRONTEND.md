# 📋 Guía de Actualización para el Frontend - Gestión de Imágenes de Productos

## 🔄 Cambios en los Endpoints

### 1. **Crear Producto** `POST /productos`

#### ❌ ANTES (Ya no funciona):
```json
{
  "codigo": "PROD-001",
  "nombre": "Producto Ejemplo",
  "categoriaId": 5,
  "imagen_url": "https://example.com/image.jpg",
  "ficha_tecnica_url": "https://example.com/doc.pdf"
}
```

#### ✅ DESPUÉS:
```json
{
  "codigo": "PROD-001",
  "nombre": "Producto Ejemplo",
  "categoriaId": 5,
  "ficha_tecnica_url": "https://example.com/doc.pdf"
}
```

**Cambio:** Eliminar `imagen_url` del payload. Las imágenes se cargan después de crear el producto.

---

### 2. **Actualizar Producto** `PATCH /productos/:id`

#### ❌ ANTES (Ya no funciona):
```json
{
  "nombre": "Nombre Actualizado",
  "imagen_url": "https://example.com/new-image.jpg"
}
```

#### ✅ DESPUÉS:
```json
{
  "nombre": "Nombre Actualizado"
}
```

**Cambio:** No se puede actualizar `imagen_url` a través de este endpoint. Usar endpoint específico de carga de imágenes.

---

### 3. **Cargar Imagen de Producto** `POST /productos/:id/upload-imagen`

#### ✅ Este endpoint continúa funcionando, con cambios en la respuesta

**Request** (sin cambios):
```javascript
const formData = new FormData();
formData.append('file', archivoDelInput);
formData.append('type', 'imagen'); // o 'ficha_tecnica'

const response = await fetch(`/productos/${idProducto}/upload-imagen`, {
  method: 'POST',
  body: formData
});
```

#### ❌ ANTES (Response):
```json
{
  "imagen_url": "https://r2.example.com/imagen-123.jpg",
  "producto": { ... }
}
```

#### ✅ DESPUÉS (Response para `type: 'imagen'`):
```json
{
  "imagen": {
    "id": 456,
    "producto_id": 123,
    "url_imagen": "https://r2.example.com/imagen-456.jpg",
    "orden": 0
  },
  "producto": { ... }
}
```

**Cambio en Response:**
- Ahora se retorna un objeto `imagen` con la estructura completa del registro creado en `producto_imagenes`
- El campo es `url_imagen` (en la BD), no `imagen_url`
- Se incluye el `orden` automáticamente asignado

#### ✅ Response para `type: 'ficha_tecnica'` (sin cambios):
```json
{
  "ficha_tecnica_url": "https://r2.example.com/ficha-123.pdf",
  "producto": { ... }
}
```

---

### 4. **Obtener Producto** `GET /productos/:id`

#### ✅ La respuesta ahora incluye array de imágenes

##### ❌ ANTES:
```json
{
  "id": 123,
  "nombre": "Producto",
  "imagen_url": "https://r2.example.com/imagen.jpg",
  "ficha_tecnica_url": "https://r2.example.com/ficha.pdf"
}
```

##### ✅ DESPUÉS:
```json
{
  "id": 123,
  "nombre": "Producto",
  "imagenes": [
    {
      "id": 1,
      "producto_id": 123,
      "url_imagen": "https://r2.example.com/imagen-1.jpg",
      "orden": 0
    },
    {
      "id": 2,
      "producto_id": 123,
      "url_imagen": "https://r2.example.com/imagen-2.jpg",
      "orden": 1
    }
  ],
  "ficha_tecnica_url": "https://r2.example.com/ficha.pdf"
}
```

**Cambio:**
- Acceder a imágenes desde `producto.imagenes[]` en lugar de `producto.imagen_url`
- Array de imágenes viene ordenado por `orden ASC`
- Cada imagen tiene su propio `id` para poder eliminarla luego si es necesario

---

### 5. **Listar Productos** `GET /productos?page=1&limit=5&search=...`

#### ✅ La respuesta incluye array de imágenes para cada producto

```json
{
  "data": [
    {
      "id": 123,
      "nombre": "Producto 1",
      "imagenes": [
        {
          "id": 1,
          "producto_id": 123,
          "url_imagen": "https://r2.example.com/img-1.jpg",
          "orden": 0
        }
      ],
      ...
    }
  ],
  "total": 50
}
```

**Cambio:**
- Cada producto en la lista ahora incluye el array `imagenes`
- Usar `producto.imagenes[0]?.url_imagen` para obtener la primera imagen

---

## 📝 Cambios en la Lógica del Frontend

### Crear Producto con Imagen

#### ❌ ANTES (En un solo paso):
```javascript
// Paso 1: Crear producto con imagen_url
const nuevoProducto = await crearProducto({
  codigo: 'PROD-001',
  nombre: 'Mi Producto',
  imagen_url: 'https://...'
});
```

#### ✅ DESPUÉS (Dos pasos):
```javascript
// Paso 1: Crear producto SIN imagen_url
const nuevoProducto = await crearProducto({
  codigo: 'PROD-001',
  nombre: 'Mi Producto'
  // ❌ No incluir imagen_url aquí
});

// Paso 2: Cargar imagen después
if (archivoImagen) {
  const formData = new FormData();
  formData.append('file', archivoImagen);
  formData.append('type', 'imagen');
  
  const imagenCargada = await fetch(
    `/productos/${nuevoProducto.id}/upload-imagen`,
    { method: 'POST', body: formData }
  );
  
  // El producto ahora tiene la imagen en producto.imagenes[0]
}
```

---

### Mostrar Imagen de Producto

#### ❌ ANTES:
```javascript
<img src={producto.imagen_url} alt={producto.nombre} />
```

#### ✅ DESPUÉS:
```javascript
<img 
  src={producto.imagenes?.[0]?.url_imagen || '/placeholder.jpg'} 
  alt={producto.nombre} 
/>
```

O si quieres mostrar múltiples imágenes (galería):
```javascript
{producto.imagenes?.map((imagen) => (
  <img 
    key={imagen.id} 
    src={imagen.url_imagen} 
    alt="Producto" 
  />
))}
```

---

### Actualizar Producto

#### ❌ ANTES:
```javascript
await actualizarProducto(idProducto, {
  nombre: 'Nuevo nombre',
  imagen_url: 'nueva-imagen.jpg' // ❌ Ya no funciona
});
```

#### ✅ DESPUÉS:
```javascript
// Opción 1: Actualizar datos (sin imagen)
await actualizarProducto(idProducto, {
  nombre: 'Nuevo nombre'
});

// Opción 2: Si necesitas cambiar la imagen, cargar una nueva
const formData = new FormData();
formData.append('file', nuevoArchivoImagen);
formData.append('type', 'imagen');

await fetch(`/productos/${idProducto}/upload-imagen`, {
  method: 'POST',
  body: formData
});
```

---

## 🖼️ Ejemplo Completo: Formulario de Producto

### ❌ ANTES (Obsoleto):
```javascript
const [producto, setProducto] = useState({
  codigo: '',
  nombre: '',
  imagen_url: '', // ❌ Eliminar
  categoriaId: null
});
const [imagenFile, setImagenFile] = useState(null);

const handleSubmit = async () => {
  // Crear producto con imagen en el mismo payload
  const response = await fetch('/productos', {
    method: 'POST',
    body: JSON.stringify(producto) // ❌ Incluía imagen_url
  });
};
```

### ✅ DESPUÉS (Correcto):
```javascript
const [producto, setProducto] = useState({
  codigo: '',
  nombre: '',
  categoriaId: null
  // ❌ Eliminar imagen_url de aquí
});
const [imagenFile, setImagenFile] = useState(null);

const handleSubmit = async () => {
  // Paso 1: Crear producto
  const response = await fetch('/productos', {
    method: 'POST',
    body: JSON.stringify(producto) // ✅ Sin imagen_url
  });
  
  const nuevoProducto = await response.json();
  
  // Paso 2: Cargar imagen si se seleccionó una
  if (imagenFile) {
    const formData = new FormData();
    formData.append('file', imagenFile);
    formData.append('type', 'imagen');
    
    await fetch(`/productos/${nuevoProducto.id}/upload-imagen`, {
      method: 'POST',
      body: formData
    });
  }
};
```

---

## ⚠️ Puntos Críticos

1. **Imagen URL no está en Producto:** El campo `imagen_url` se removió completamente de la tabla `productos`. Si intentas enviarlo, será ignorado (no causa error, solo se ignora).

2. **Las imágenes son un array:** Ahora un producto puede tener múltiples imágenes. Actualizar el código que accede a `producto.imagen_url` para usar `producto.imagenes[0]?.url_imagen`.

3. **Dos pasos para crear con imagen:** Primero crear el producto, luego cargar la imagen. Esto es más flexible porque permite cargar múltiples imágenes si es necesario.

4. **Orden de imágenes es automático:** El sistema asigna `orden: 0, 1, 2...` según el orden de carga. No necesitas manejarlo desde el frontend.

---

## 📱 Checklist de Actualización para Frontend

- [ ] Eliminar campo `imagen_url` del formulario de crear producto
- [ ] Eliminar campo `imagen_url` del formulario de editar producto
- [ ] Actualizar llamadas a `POST /productos` para no incluir `imagen_url`
- [ ] Actualizar llamadas a `PATCH /productos/:id` para no incluir `imagen_url`
- [ ] Cambiar visualización de imagen de `producto.imagen_url` a `producto.imagenes?.[0]?.url_imagen`
- [ ] Ajustar lógica de carga de imágenes para hacerla después de crear el producto
- [ ] Actualizar manejo de response del endpoint `/productos/:id/upload-imagen`
- [ ] Pruebas de creación, actualización y carga de imágenes

---

## 🆘 Errores Comunes a Evitar

### ❌ Error 1: Intentar pasar `imagen_url` al crear
```javascript
// INCORRECTO - será ignorado
await fetch('/productos', {
  method: 'POST',
  body: JSON.stringify({
    nombre: 'Producto',
    imagen_url: 'https://...' // ❌ Ignorado silenciosamente
  })
});
```

### ❌ Error 2: Acceder a `producto.imagen_url`
```javascript
// INCORRECTO - será undefined
const src = producto.imagen_url; // ❌ undefined

// CORRECTO
const src = producto.imagenes?.[0]?.url_imagen;
```

### ❌ Error 3: Olvidar cargar imagen después de crear
```javascript
// INCORRECTO - producto sin imágenes
const producto = await crearProducto({...});
// Dejar el formulario aquí sin cargar imagen

// CORRECTO - cargar imagen después
const producto = await crearProducto({...});
await cargarImagen(producto.id, archivoImagen);
```

---

## 📞 Resumen Rápido

| Acción | Cambio |
|--------|--------|
| Crear producto | ❌ Quitar `imagen_url` del payload |
| Actualizar producto | ❌ Quitar `imagen_url` del payload |
| Cargar imagen | ✅ Response ahora es `{ imagen: {...}, producto: {...} }` |
| Ver imagen | ✅ Usar `producto.imagenes?.[0]?.url_imagen` |
| Múltiples imágenes | ✅ Acceder a `producto.imagenes[]` (array ordenado) |
