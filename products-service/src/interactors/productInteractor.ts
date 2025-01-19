import { off } from "process";
import { IProductInteractor } from "../interfaces/iProductInteractor";
import { IProductRepository } from "../interfaces/iProductRepository";

export class ProductInteractor implements IProductInteractor {

    private repository: IProductRepository;

    constructor(repository: IProductRepository){
        this.repository = repository;
    }

    async createProduct(input: any) {
        return this.repository.create(input);
    }

    async updateStock(id: number, stock: number) {

        return this.repository.update(id,stock);
    }

    async getProducts(limit: number, offset: number) {
       return this.repository.find(limit, offset);
    }

}