import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPasswordResetFieldsToUsuariosAdmin1733802000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'usuarios_admin',
            new TableColumn({
                name: 'reset_password_token',
                type: 'varchar',
                length: '255',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'usuarios_admin',
            new TableColumn({
                name: 'reset_password_expires',
                type: 'datetime',
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('usuarios_admin', 'reset_password_expires');
        await queryRunner.dropColumn('usuarios_admin', 'reset_password_token');
    }
}
