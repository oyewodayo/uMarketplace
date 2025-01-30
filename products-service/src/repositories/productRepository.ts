import { Product } from "../entities/Product";
import { IProductRepository } from "../interfaces/iProductRepository";
import { PrismaClient } from "@prisma/client";

export class ProductRepository implements IProductRepository {
   
    _prisma: PrismaClient;

    constructor() {
       this._prisma = new PrismaClient();
    }

    async create(data: Product): Promise<Product> {
        
        return this._prisma.product.create({data,});
    }

    async update(data: Product): Promise<Product> {
        
        return this._prisma.product.update({
            where: {id: data.id},
            data
        });
    }

    async find(limit: number, offset: number): Promise<Product[]> {
        
        return this._prisma.product.findMany({
            take: limit,
            skip: offset
        });
    }

    async findOne(id: number): Promise<Product>{
        const product = await this._prisma.product.findFirst({
            where:{id},
        });

        if (product) {
            return Promise.resolve(product);
        }

        throw new Error("Product not found");
    }

    async delete(id: any): Promise<Product> {
        
        return this._prisma.product.delete({
            where: {id},
        });
    }
}
