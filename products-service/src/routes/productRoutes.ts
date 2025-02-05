import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ProductRepository } from "../repositories/productRepository";
import { CatalogService } from "../services/product.service";
import { ProductController } from "../controllers/ProductController";
import { ProductQueryString, ProductParams, UpdateStockBody } from "../interfaces/productInterfaces";

export const productRouter = async (fastify: FastifyInstance) => {
  const repository = new ProductRepository();
  const catalogService = new CatalogService(repository);
  const controller = new ProductController(catalogService);

  fastify.post("/products", (req: FastifyRequest, res: FastifyReply) =>
    controller.onCreateProduct(req, res)
  );

  fastify.get<{ Querystring: ProductQueryString }>("/products", (req, res) =>
    controller.onGetProducts(req, res)
  );

  fastify.patch<{ Params: ProductParams; Body: UpdateStockBody }>("/products/:id", (req, res) =>
    controller.onUpdateStock(req, res)
  );

  fastify.put<{ Params: ProductParams; Body: UpdateStockBody }>("/products/:id", (req, res) =>
    controller.onUpdateStock(req, res)
  );
};
