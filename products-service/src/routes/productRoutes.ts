import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from "../repositories/productRepository";
import { CatalogService } from "../services/product.service";
import { ProductController } from "../controllers/ProductController";
import { ProductQueryString, ProductParams, UpdateStockBody, UpdateNameBody } from "../interfaces/productInterfaces";

const prisma = new PrismaClient();

export const productRouter = async (fastify: FastifyInstance) => {
  // Initialization of PrismaClient instance on repository
  const repository = new ProductRepository(prisma);
  const catalogService = new CatalogService(repository);
  const controller = new ProductController(catalogService);

  // Register graceful shutdown
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  fastify.post("/products", (req: FastifyRequest, res: FastifyReply) =>
    controller.onCreateProduct(req, res)
  );

  fastify.get<{ Querystring: ProductQueryString }>("/products", (req, res) =>
    controller.onGetProducts(req, res)
  );

  fastify.patch<{ Params: ProductParams; Body: UpdateStockBody }>(
    "/products/:id",
    (req, res) => controller.onUpdateStock(req, res)
  );

  fastify.put<{ Params: ProductParams; Body: UpdateStockBody }>(
    "/products/:id",
    (req, res) => controller.onUpdateStock(req, res)
  );
  fastify.patch<{ Params: ProductParams; Body: UpdateNameBody }>(
    "/products/:id/name",
    (req, res) => controller.onUpdateName(req, res)
  );
};