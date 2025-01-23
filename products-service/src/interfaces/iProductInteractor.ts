

export interface IProductInteractor {
    createProduct(input: any);
    updateStock(data: Object);
    getProducts(limit: number, offset: number);
}