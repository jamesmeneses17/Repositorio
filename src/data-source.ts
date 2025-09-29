import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Cargar variables de entorno para migraciones
if (process.env.NODE_ENV === 'migration') {
  config({ path: '.env.migration' });
} else {
  config({ path: '.env' });
}
import { Categoria } from './modules/catalogos_basicos/categorias/entities/categoria.entity';
import { Subcategoria } from './modules/catalogos_basicos/subcategorias/entities/subcategoria.entity';
import { UsuariosAdmin } from './modules/cliente-administracion/usuarios-admin/entities/usuarios-admin.entity';
import { Producto } from './modules/gestion_producto/productos/entities/producto.entity';
import { Marca } from './modules/catalogos_basicos/marcas/entities/marca.entity';
import { UnidadMedida } from './modules/catalogos_basicos/unidades-medida/entities/unidad-medida.entity';
import { Especificacion } from './modules/catalogos_basicos/especificaciones/entities/especificacion.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sistema_ventas',
  entities: [Categoria, Subcategoria, UsuariosAdmin, Producto, Marca, UnidadMedida, Especificacion],
  migrations: ['src/migrations/*.ts'],
});

