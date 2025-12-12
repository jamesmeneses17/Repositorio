import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveImagenUrlFromProductos20251211 implements MigrationInterface {
  name = 'RemoveImagenUrlFromProductos20251211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la columna imagen_url de la tabla productos
    await queryRunner.query('ALTER TABLE `productos` DROP COLUMN `imagen_url`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar la columna imagen_url en caso de rollback
    await queryRunner.query(
      'ALTER TABLE `productos` ADD COLUMN `imagen_url` varchar(255) NULL'
    );
  }
}
