import { IProductRepository } from "../interfaces/iProductRepository";

export class CatalogService {
  private _repository: IProductRepository;

  constructor(repository: IProductRepository) {
    this._repository = repository;
  }

  async createProduct(input: any) {
    const data = await this._repository.create(input);
    if (!data.id) {
      throw new Error("Unable to create product");
    }
    return data;
  }

  async updateProduct(input: any) {
    const data = await this._repository.update(input);
    if (!data.id) {
      throw new Error("Unable to update product");
    }
    return data;
  }

  async getProducts(limit: number, offset: number) {
    return await this._repository.find(limit, offset);
  }

  async getProduct(id: number) {
    return await this._repository.findOne(id);
  }

  async deleteProduct(id: number) {
    return await this._repository.delete(id);
  }

  async getProductStock(ids: number[]) {
    const products = await this._repository.findStock(ids);
    if (!products) {
      throw new Error("Unable to find product stock details");
    }
    return products;
  }
}
