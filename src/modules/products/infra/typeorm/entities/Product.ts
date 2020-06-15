import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ValueTransformer,
  // OneToMany,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

const columnNumericTransformer: ValueTransformer = {
  from: (data?: string | null) => {
    return data ? parseFloat(data) : null;
  },
  to: (data?: number | null) => {
    return data || null;
  },
};

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('numeric', {
    transformer: columnNumericTransformer,
  })
  price: number;

  @Column('numeric', {
    transformer: columnNumericTransformer,
  })
  quantity: number;

  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
