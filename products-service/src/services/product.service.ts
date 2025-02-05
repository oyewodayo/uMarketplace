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

  async updateProduct(input: { id: number; stock: number }): Promise<Product> {
    // First, fetch the existing product
    const existingProduct = await this._repository.findOne(input.id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Create a new Product instance with updated stock
    const updatedProduct = new Product(
      existingProduct.name,
      existingProduct.description,
      existingProduct.price,
      input.stock,
      existingProduct.id
    );

    // Update the product with all required fields
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
