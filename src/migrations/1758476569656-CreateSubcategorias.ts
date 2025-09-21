import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubcategorias1758476569656 implements MigrationInterface {
    name = 'CreateSubcategorias1758476569656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` CHANGE \`rol\` \`rol\` varchar(20) NOT NULL DEFAULT 'admin'`);
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` DROP COLUMN \`fecha_creacion\``);
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` ADD \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subcategorias\` ADD CONSTRAINT \`FK_b15fe98fc00a27b01420611b73b\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subcategorias\` DROP FOREIGN KEY \`FK_b15fe98fc00a27b01420611b73b\``);
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` DROP COLUMN \`fecha_creacion\``);
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` ADD \`fecha_creacion\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` CHANGE \`rol\` \`rol\` varchar(20) NULL`);
    }

}
