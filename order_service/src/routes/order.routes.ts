import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { OrderStatus } from "../types";
import { RequestAuthorizer } from "./middleware";
import * as service from "../service/order.service";
import { OrderRepository } from "../repository/order.repository";
import { CartRepository } from "../repository/cart.repository";

const repo = OrderRepository;
const cartRepo = CartRepository;

export async function orderRoutes(fastify: FastifyInstance) {
  
  fastify.post(
    "/orders",
    { preHandler: RequestAuthorizer },
    async (req: FastifyRequest, res: FastifyReply) => {
      const user = req.user;
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const response = await service.CreateOrder(user.id, repo, cartRepo);
      return res.status(200).send(response);
    }
  );

  fastify.get(
    "/orders",
    async (req: FastifyRequest, res: FastifyReply) => {
      const user = req.user;
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const response = await service.GetOrders(user.id, repo);
      return res.status(200).send(response);
    }
  );

  fastify.get(
    "/orders/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
      const user = req.user;
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const response = await service.GetOrder(user.id, repo);
      return res.status(200).send(response);
    }
  );

  fastify.patch(
    "/orders/:id",
    async (req: FastifyRequest<{ Params: { id: string }; Body: { status: OrderStatus } }>, res: FastifyReply) => {
      const orderId = parseInt(req.params.id);
      const status = req.body.status;
      const response = await service.UpdateOrder(orderId, status, repo);
      return res.status(200).send(response);
    }
  );

  fastify.delete(
    "/orders/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
      const user = req.user;
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const orderId = parseInt(req.params.id);
      const response = await service.DeleteOrder(orderId, repo);
      return res.status(200).send(response);
    }
  );
}
