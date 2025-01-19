import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  constructor(scyllaClient, cache) {
    this.scyllaClient = scyllaClient;
    this.cache = cache;
  }

  async createProduct(productData) {
    const id = uuidv4();
    const timestamp = new Date();
    
    const query = `
      INSERT INTO ecommerce.products (
        id, name, description, price, stock, category, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      productData.name,
      productData.description,
      productData.price,
      productData.stock,
      productData.category,
      timestamp,
      timestamp
    ];

    await this.scyllaClient.execute(query, params, { prepare: true });
    
    // Also insert into products_by_category
    await this.scyllaClient.execute(`
      INSERT INTO ecommerce.products_by_category (
        category, id, name, price, stock
      ) VALUES (?, ?, ?, ?, ?)
    `, [productData.category, id, productData.name, productData.price, productData.stock], 
    { prepare: true });

    this.cache.del('products_by_category_' + productData.category);
    
    return { id, ...productData, created_at: timestamp, updated_at: timestamp };
  }

  async getProduct(id) {
    const cacheKey = `product_${id}`;
    const cachedProduct = this.cache.get(cacheKey);
    
    if (cachedProduct) {
      return cachedProduct;
    }

    const query = 'SELECT * FROM ecommerce.products WHERE id = ?';
    const result = await this.scyllaClient.execute(query, [id], { prepare: true });
    const product = result.first();

    if (product) {
      this.cache.set(cacheKey, product);
    }
    
    return product;
  }

  async updateProduct(id, updates) {
    const timestamp = new Date();
    const sets = Object.keys(updates)
      .filter(key => key !== 'id')
      .map(key => `${key} = ?`)
      .join(', ');

    const query = `
      UPDATE ecommerce.products 
      SET ${sets}, updated_at = ? 
      WHERE id = ?
    `;

    const params = [...Object.values(updates), timestamp, id];
    await this.scyllaClient.execute(query, params, { prepare: true });

    // Update products_by_category if category or relevant fields changed
    if (updates.category || updates.name || updates.price || updates.stock) {
      const product = await this.getProduct(id);
      await this.scyllaClient.execute(`
        UPDATE ecommerce.products_by_category 
        SET name = ?, price = ?, stock = ?
        WHERE category = ? AND id = ?
      `, [
        updates.name || product.name,
        updates.price || product.price,
        updates.stock || product.stock,
        product.category,
        id
      ], { prepare: true });
      
      this.cache.del('products_by_category_' + product.category);
    }

    this.cache.del(`product_${id}`);
    return { id, ...updates, updated_at: timestamp };
  }

  async deleteProduct(id) {
    const product = await this.getProduct(id);
    if (!product) {
      return null;
    }

    await this.scyllaClient.execute(
      'DELETE FROM ecommerce.products WHERE id = ?',
      [id],
      { prepare: true }
    );

    await this.scyllaClient.execute(
      'DELETE FROM ecommerce.products_by_category WHERE category = ? AND id = ?',
      [product.category, id],
      { prepare: true }
    );

    this.cache.del(`product_${id}`);
    this.cache.del('products_by_category_' + product.category);
    
    return { success: true };
  }

  async getProductsByCategory(category) {
    const cacheKey = `products_by_category_${category}`;
    const cachedProducts = this.cache.get(cacheKey);
    
    if (cachedProducts) {
      return cachedProducts;
    }

    const query = 'SELECT * FROM ecommerce.products_by_category WHERE category = ?';
    const result = await this.scyllaClient.execute(query, [category], { prepare: true });
    const products = result.rows;

    this.cache.set(cacheKey, products);
    return products;
  }
}