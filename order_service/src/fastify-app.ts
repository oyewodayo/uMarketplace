import Fastify from "fastify";
import cors from "@fastify/cors";
import { cartRouter } from "./routes/cart.routes";
import { orderRouter } from "./routes/order.routes";

const fastify = Fastify({
  logger: true,
});

// Register the CORS plugin
fastify.register(cors);

// Register all routes
fastify.register(cartRouter)
fastify.register(orderRouter)


export default fastify;