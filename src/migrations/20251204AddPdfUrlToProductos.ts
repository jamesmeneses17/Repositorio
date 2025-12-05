import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPdfUrlToProductos20251204 implements MigrationInterface {
  name = 'AddPdfUrlToProductos20251204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `productos` ADD COLUMN `pdf_url` varchar(255) NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `productos` DROP COLUMN `pdf_url`');
  }
}
