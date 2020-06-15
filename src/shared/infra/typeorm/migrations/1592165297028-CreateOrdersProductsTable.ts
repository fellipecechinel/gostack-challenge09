import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrdersProductsTable1592165297028
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'orders_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'price',
            type: 'numeric',
            precision: 12,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
          },
          {
            columnNames: ['order_id'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('products');
  }
}
