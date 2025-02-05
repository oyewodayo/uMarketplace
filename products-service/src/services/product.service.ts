import { IProductRepository } from "../interfaces/iProductRepository";
import { Product } from "../entities/Product";

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

  async updateProduct(input: { 
    id: number; 
    stock?: number;
    name?: string;
    updateType: 'stock' | 'name';
  }): Promise<Product> {
    const existingProduct = await this._repository.findOne(input.id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Create updated product based on update type
    const updatedProduct = new Product(
      input.updateType === 'name' ? input.name! : existingProduct.name,
      existingProduct.description,
      existingProduct.price,
      input.updateType === 'stock' ? input.stock! : existingProduct.stock,
      existingProduct.id
    );

    const data = await this._repository.update(updatedProduct);
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
