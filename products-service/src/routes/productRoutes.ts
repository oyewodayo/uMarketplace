import { FastifyInstance } from "fastify";
import { ProductRepository } from "../repositories/productRepository";
import { ProductInteractor } from "../interactors/productInteractor";
import { ProductController } from "../controllers/ProductController";

const repository = new ProductRepository();
const interactor = new ProductInteractor(repository);

const controller = new ProductController(interactor);


export const productRouter = async (fastify: FastifyInstance)=>{
    fastify.post("${}/products", controller.onCreateProduct.bind(controller));
    fastify.get("/products", controller.onGetProducts.bind(controller));
    fastify.put("/products/:id", controller.onUpdateStock.bind(controller));
}