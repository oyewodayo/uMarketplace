

import { Client } from "cassandra-driver";
import { Product } from "../entities/Product";
import { IProductRepository } from "../interfaces/iProductRepository";
import { getScyllaClient } from "../dbConnection";


export class ProductRepository implements IProductRepository  {

    private client!: Client;

    constructor(){
        this.initializeClient()
    }


    private async initializeClient(){
        this.client = await getScyllaClient();
    }


async create({name, description, price, stock}:Product): Promise<Product>{

        const id = require('cassandra-driver').types.Uuid().random();
        const query =  `INSERT INTO products (name, descript, price, stock) VALUES ($1,$2,$3,$4) `;
        const params =  [name, description, price, stock];
       
        await this.client.execute(query, params, {prepare:true});

        const result = await this.client.execute(
            'SELECT * FROM products WHERE id = ?',
            [id],
            {prepare:true}
        )

        const product = this.mapToProduct(result.first());
        if (!product) {
            throw new Error('Failed to create product');
        }
        return product;
    }

    async  update(data:Product): Promise<Product>{

        const query = `
            UPDATE products
            SET stock = ?
            WHERE id = ?
        `

        const params = [data.stock, data.id];
        await this.client.execute(query, params, {prepare:true});

        const result = await this.client.execute(
            'SELECT * FROM products WHERE id = ?',
            [data.id],
            { prepare: true }
        );

        const product = this.mapToProduct(result.first());
        if (!product) {
            throw new Error(`Product with id ${data.id} not found`);
        }
        return product;
    }

    async find(limit: number, offset: number): Promise<Product[]> {
        const query = 'SELECT * FROM products LIMIT ?';
        
        const options = {
            prepare: true,
            fetchSize: limit
        };

        const result = await this.client.execute(query, [limit], options);

        return result.rows.map(row => {
            const product = this.mapToProduct(row);
            if (!product) {
                throw new Error('Invalid product data in database');
            }
            return product;
        });
    }

    // Helper method to map ScyllaDB row to Product entity
    private mapToProduct(row: any): Product | null {
        if (!row) return null;
        
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            stock: row.stock
        };
    }
}