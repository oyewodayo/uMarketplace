import Fastify from "fastify";
import authRoutes from "./routes/authRoutes.js";

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 9000;

export default async function (fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { message: 'Hello World' };
  });
}

fastify.register(authRoutes, { prefix: "/auth" });

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
