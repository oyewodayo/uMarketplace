import { PrismaClient } from '@prisma/client';
import { Product } from '../entities/Product';
import { IProductRepository } from '../interfaces/iProductRepository';

export class ProductRepository implements IProductRepository {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async create(data: Product): Promise<Product> {
    const product = await this._prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });

    return new Product(
      product.name,
      product.description,
      product.price,
      product.stock,
      product.id
    );
  }

  async update(data: Product): Promise<Product> {
    const product = await this._prisma.product.update({
      where: {
        id: Number(data.id) 
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });

    return new Product(
      product.name,
      product.description,
      product.price,
      product.stock,
      product.id
    );
  }

  async findOne(id: number): Promise<Product> {
    const product = await this._prisma.product.findUnique({ 
      where: {
        id: Number(id) 
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return new Product(
      product.name,
      product.description,
      product.price,
      product.stock,
      product.id
    );
  }

  async find(limit: number, offset: number): Promise<Product[]> {
    const products = await this._prisma.product.findMany({
      take: limit,
      skip: offset,
    });

    return products.map(
      (product) =>
        new Product(
          product.name,
          product.description,
          product.price,
          product.stock,
          product.id
        )
    );
  }

  async delete(id: number): Promise<Product> {
    const product = await this._prisma.product.delete({
      where: {
        id: Number(id) 
      },
    });

    return new Product(
      product.name,
      product.description,
      product.price,
      product.stock,
      product.id
    );
  }

  async findStock(ids: number[]): Promise<Product[]> {
    const products = await this._prisma.product.findMany({
      where: {
        id: {
          in: ids.map(id => Number(id)) 
        },
      },
    });

    return products.map(
      (product) =>
        new Product(
          product.name,
          product.description,
          product.price,
          product.stock,
          product.id
        )
    );
  }
}