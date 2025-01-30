import { Product } from "../entities/Product";

export interface IProductRepository  {
    create(data:Product): Promise<Product>;
    update(data:Product): Promise<Product>;
    delete(id: number): Promise<Product>;
    find(limit:number, offset: number): Promise<Product[]>;
    findOne(id:number): Promise<Product>;
}