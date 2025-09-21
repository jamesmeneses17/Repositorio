import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNullRoles1758488300000 implements MigrationInterface {
    name = 'FixNullRoles1758488300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primero actualizar todos los valores NULL a 'admin'
        await queryRunner.query(`UPDATE \`usuarios_admin\` SET \`rol\` = 'admin' WHERE \`rol\` IS NULL`);
        
        // Luego aplicar la restricción NOT NULL
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` CHANGE \`rol\` \`rol\` varchar(20) NOT NULL DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios_admin\` CHANGE \`rol\` \`rol\` varchar(20) NULL`);
    }
}