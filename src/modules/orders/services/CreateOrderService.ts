import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IProductInsert {
  product_id: string;
  price: number;
  quantity: number;
}

interface IProductUpdate {
  id: string;
  quantity: number;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Invalid customer');
    }

    const productsIds = products.map(product => ({ id: product.id }));

    const productsInDatabase = await this.productsRepository.findAllById(
      productsIds,
    );

    if (productsInDatabase.length !== products.length) {
      throw new AppError('There are invalid products');
    }

    const productsToInsert: IProductInsert[] = [];
    const productsToUpdate: IProductUpdate[] = [];

    products.forEach(product => {
      const productDatabase = productsInDatabase.find(
        item => item.id === product.id,
      );

      if (!productDatabase) return;

      if (productDatabase?.quantity < product.quantity) {
        throw new AppError(`Product ${product.id} has insufficient quantity`);
      }

      productsToUpdate.push({
        id: product.id,
        quantity: productDatabase.quantity - product.quantity,
      });

      productsToInsert.push({
        product_id: product.id,
        quantity: product.quantity,
        price: productDatabase.price,
      });
    });

    await this.productsRepository.updateQuantity(productsToUpdate);

    const order = await this.ordersRepository.create({
      customer,
      products: productsToInsert,
    });

    return order;
  }
}

export default CreateOrderService;
