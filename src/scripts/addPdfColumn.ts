import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config({ path: '.env' });

async function run() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'sistema_ventas';

  const conn = await mysql.createConnection({ host, port, user, password, database });
  try {
    console.log('Conectado a DB. Comprobando existencia de columna `pdf_url`...');
    const [rows] = await conn.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'pdf_url'`,
      [database],
    );
    // @ts-ignore
    if ((rows as any[]).length === 0) {
      console.log('Columna no encontrada. Ejecutando ALTER TABLE para añadir `pdf_url`...');
      await conn.execute("ALTER TABLE `productos` ADD COLUMN `pdf_url` varchar(255) NULL");
      console.log('Columna `pdf_url` añadida.');
    } else {
      console.log('La columna `pdf_url` ya existe. No se realizan cambios.');
    }
  } catch (err) {
    console.error('Error ejecutando chequeo/ALTER TABLE:', err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

run();
