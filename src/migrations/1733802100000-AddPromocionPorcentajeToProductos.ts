import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPromocionPorcentajeToProductos1733802100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'productos',
            new TableColumn({
                name: 'promocion_porcentaje',
                type: 'decimal',
                precision: 5,
                scale: 2,
                default: 0,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('productos', 'promocion_porcentaje');
    }
}
