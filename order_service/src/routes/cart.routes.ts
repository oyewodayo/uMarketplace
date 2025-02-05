import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { CartRequestInput, CartRequestSchema } from "../models/cartRequest";
import { RequestAuthorizer } from "./middleware";

const repo = repository.CartRepository;

export const cartRouter = async (fastify: FastifyInstance) => {
  // Add the RequestAuthorizer middleware to all routes
  fastify.addHook("onRequest", RequestAuthorizer);

  // Cart post request
  fastify.post(
    "/cart",
    {
      schema: {
        body: CartRequestSchema, // Use Fastify's schema validation
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const user = req.user; // Assuming req.user is added by RequestAuthorizer
        if (!user) {
          throw new Error("User not found");
        }

        const input: CartRequestInput = req.body as CartRequestInput;

        const response = await service.CreateCart(
          {
            ...input,
            customerId: user.id,
          },
          repo
        );
        return res.status(200).send(response);
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );

  // Cart Get request
  fastify.get("/cart", async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const user = req.user;
      if (!user) {
        throw new Error("User not found");
      }

      const response = await service.GetCart(user.id, repo);
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  });

  // Update an item in the Cart PATCH /cart/:lineItemId
  fastify.patch(
    "/cart/:lineItemId",
    async (req: FastifyRequest<{ Params: { lineItemId: string }; Body: { qty: number } }>, res: FastifyReply) => {
      try {
        const user = req.user;
        if (!user) {
          throw new Error("User not found");
        }

        const lineItemId = req.params.lineItemId;
        const response = await service.EditCart(
          {
            id: +lineItemId,
            qty: req.body.qty,
            customerId: user.id,
          },
          repo
        );
        return res.status(200).send(response);
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );

  // DELETE an item from the Card /cart/:lineItemId
  fastify.delete(
    "/cart/:lineItemId",
    async (req: FastifyRequest<{ Params: { lineItemId: string } }>, res: FastifyReply) => {
      try {
        const user = req.user;
        if (!user) {
          throw new Error("User not found");
        }

        const lineItemId = req.params.lineItemId;
        const response = await service.DeleteCart(
          { customerId: user.id, id: +lineItemId },
          repo
        );
        return res.status(200).send(response);
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );
};