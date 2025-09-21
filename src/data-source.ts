import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Cargar variables de entorno para migraciones
config({ path: process.env.NODE_ENV === 'migration' ? '.env.migration' : '.env' });
import { Categoria } from './modules/categorias/entities/categoria.entity';
import { Subcategoria } from './modules/subcategorias/entities/subcategoria.entity';
import { UsuarioAdmin } from './modules/usuarios-admin/entities/usuarios-admin.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sistema_ventas',
  entities: [Categoria, Subcategoria, UsuarioAdmin],
  migrations: ['src/migrations/*.ts'],
});

