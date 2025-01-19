import { Pool } from "pg";
import { Product } from "../entities/Product";
import { IProductRepository } from "../interfaces/iProductRepository";
import { pgClient } from "../dbConnectionPG"; // Reuse your pgClient function

export class ProductRepository implements IProductRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient(); // Initialize the PostgreSQL client
    }

    async create({ name, description, price, stock }: Product): Promise<Product> {
        const query = `
            INSERT INTO products (name, description, price, stock)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const params = [name, description, price, stock];

        const result = await this.client.query(query, params);

        const product = result.rows[0];
        if (!product) {
            throw new Error("Failed to create product");
        }
        return product;
    }

    async update(id: number, stock: number): Promise<Product> {
        const query = `
            UPDATE products
            SET stock = $1
            WHERE id = $2
            RETURNING *;
        `;
        const params = [stock, id];

        const result = await this.client.query(query, params);

        const product = result.rows[0];
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        return product;
    }

    async find(limit: number, offset: number): Promise<Product[]> {
        const query = `
            SELECT * FROM products
            LIMIT $1 OFFSET $2;
        `;
        const params = [limit, offset];

        const result = await this.client.query(query, params);

        return result.rows.map(row => {
            const product = this.mapToProduct(row);
            if (!product) {
                throw new Error("Invalid product data in database");
            }
            return product;
        });
    }

    // Helper method to map PostgreSQL row to Product entity
    private mapToProduct(row: any): Product | null {
        if (!row) return null;

        return {
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            stock: row.stock,
        };
    }
}
