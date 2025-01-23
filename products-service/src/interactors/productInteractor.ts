import { off } from "process";
import { IProductInteractor } from "../interfaces/iProductInteractor";
import { IProductRepository } from "../interfaces/iProductRepository";
import { Product } from "../entities/Product";

export class ProductInteractor implements IProductInteractor {

    //Repository
    private repository: IProductRepository;

    constructor(repository: IProductRepository){
        this.repository = repository;
    }

    async createProduct(input: any) {
        return this.repository.create(input);
    }

    async updateStock(data:Product) {

        return this.repository.update(data);
    }

    async getProducts(limit: number, offset: number) {
       return this.repository.find(limit, offset);
    }

}