import { AppDataSource } from './data-source';

async function run() {
  try {
    console.log('Inicializando conexión a la base de datos...');
    await AppDataSource.initialize();
    console.log('Conexión establecida. Ejecutando migraciones...');
    const result = await AppDataSource.runMigrations();
    console.log('Migraciones ejecutadas:', result.map(r => r.name));
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Error al ejecutar migraciones:', err);
    process.exit(1);
  }
}

run();
