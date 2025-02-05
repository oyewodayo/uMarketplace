import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from "../repositories/productRepository";
import { CatalogService } from "../services/product.service";
import { ProductController } from "../controllers/ProductController";
import { ProductQueryString, ProductParams, UpdateStockBody } from "../interfaces/productInterfaces";

// Create a single instance of PrismaClient
const prisma = new PrismaClient();

export const productRouter = async (fastify: FastifyInstance) => {
  // Initialize repository with PrismaClient instance
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
};