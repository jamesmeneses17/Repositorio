import { MigrationInterface, QueryRunner } from 'typeorm';

// Migration to replace estado_id with activo in categorias and add activo to related tables
export class AddActivoToCategoriasAndRelated1733945000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop FK on estado_id if it exists
        const fkEstado = await queryRunner.query(`
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'categorias'
              AND COLUMN_NAME = 'estado_id'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        for (const row of fkEstado) {
            await queryRunner.query(`ALTER TABLE categorias DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``);
        }

        // Drop estado_id column if present
        const estadoColumn = await queryRunner.query(`SHOW COLUMNS FROM categorias LIKE 'estado_id'`);
        if (estadoColumn.length) {
            await queryRunner.query(`ALTER TABLE categorias DROP COLUMN estado_id`);
        }

        // Add activo to categorias if missing
        const activoCategoria = await queryRunner.query(`SHOW COLUMNS FROM categorias LIKE 'activo'`);
        if (!activoCategoria.length) {
            await queryRunner.query(`ALTER TABLE categorias ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER nombre`);
        }

        // Add activo to categorias_principales if missing
        const activoCatPrin = await queryRunner.query(`SHOW COLUMNS FROM categorias_principales LIKE 'activo'`);
        if (!activoCatPrin.length) {
            await queryRunner.query(`ALTER TABLE categorias_principales ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER nombre`);
        }

        // Add activo to subcategorias if missing
        const activoSub = await queryRunner.query(`SHOW COLUMNS FROM subcategorias LIKE 'activo'`);
        if (!activoSub.length) {
            await queryRunner.query(`ALTER TABLE subcategorias ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER nombre`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove activo columns when present
        const activoSub = await queryRunner.query(`SHOW COLUMNS FROM subcategorias LIKE 'activo'`);
        if (activoSub.length) {
            await queryRunner.query(`ALTER TABLE subcategorias DROP COLUMN activo`);
        }

        const activoCatPrin = await queryRunner.query(`SHOW COLUMNS FROM categorias_principales LIKE 'activo'`);
        if (activoCatPrin.length) {
            await queryRunner.query(`ALTER TABLE categorias_principales DROP COLUMN activo`);
        }

        const activoCategoria = await queryRunner.query(`SHOW COLUMNS FROM categorias LIKE 'activo'`);
        if (activoCategoria.length) {
            await queryRunner.query(`ALTER TABLE categorias DROP COLUMN activo`);
        }

        // Recreate estado_id on categorias if missing
        const estadoColumn = await queryRunner.query(`SHOW COLUMNS FROM categorias LIKE 'estado_id'`);
        if (!estadoColumn.length) {
            await queryRunner.query(`ALTER TABLE categorias ADD COLUMN estado_id INT NOT NULL DEFAULT 1 AFTER nombre`);
        }

        // Recreate FK to estados if missing
        const fkEstado = await queryRunner.query(`
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'categorias'
              AND COLUMN_NAME = 'estado_id'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        if (!fkEstado.length) {
            await queryRunner.query(`ALTER TABLE categorias ADD CONSTRAINT FK_categorias_estado FOREIGN KEY (estado_id) REFERENCES estados(id)`);
        }
    }
}
