

export interface IProductInteractor {
    createProduct(input: any): Promise<any>;
    updateStock(id: number, stock: number): Promise<any>;
    getProducts(limit: number, offset: number): Promise<any>;
}