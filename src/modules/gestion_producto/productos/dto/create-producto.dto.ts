import { IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber, Min } from 'class-validator';

export class CreateProductoDto {
  // 📦 Datos básicos del producto
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  codigo: string;

  @IsOptional()
  @IsString()
  ficha_tecnica_url?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsOptional()
  @IsString()
  pdf_url?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  // 🔗 Relaciones
  @IsNumber()
  @IsOptional()
  estadoId?: number;

  @IsNumber()
  @IsOptional()
  categoriaId?: number;

  // 💰 Campos para precios
  @IsNumber()
  @IsOptional() // o @IsNotEmpty() si el precio inicial es obligatorio
  precio?: number; // Se mantiene por compatibilidad (precio de venta)

  // Nuevo campo explícito para precio de venta (frontend -> backend)
  @IsNumber()
  @IsOptional()
  @Min(0)
  precio_venta?: number;

  // ✅ Costo de compra para la tabla 'productos'
  @IsNumber()
  @IsOptional()
  precio_costo?: number;

  // ✅ Precio base de venta inicial (para crear registro en 'precios')
  @IsNumber()
  @IsOptional()
  valor_unitario_inicial?: number;

  // 🏬 Campos para inventario
  @IsNumber()
  @IsOptional()
  stock?: number; // Se usa para crear el registro en la tabla 'inventario'

  @IsOptional()
  @IsString()
  ubicacion?: string; // Campo de la tabla 'inventario'

  @IsNumber()
  @IsOptional()
  @Min(0)
  stockMinimo?: number; // 🔑 NUEVO campo para definir el stock mínimo permitido
}
