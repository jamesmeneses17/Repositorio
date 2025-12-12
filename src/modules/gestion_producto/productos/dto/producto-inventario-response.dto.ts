import { ApiProperty } from '@nestjs/swagger';

export class ProductoInventarioResponseDto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string | null;
  subcategoria_id?: number | null;
  stock: number;
  precio: number;
  precio_venta: number;
  estado_stock: 'Disponible' | 'Stock Bajo' | 'Agotado';
  compras: number;
  ventas?: number;
  ubicacion?: string | null;
  promocion_porcentaje?: number;
  precio_con_descuento: number;
  utilidad: number;
  valor_inventario: number;
}
