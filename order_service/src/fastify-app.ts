import Fastify from "fastify";
import cors from "@fastify/cors";
import { cartRouter } from "./routes/cart.routes";
import { orderRouter } from "./routes/order.routes";


const fastify = Fastify({
    logger: {
        level: 'trace',
        file: './log',
        serializers: {
            req(request) {
                return {
                    method: request.method,
                    url: request.url,
                    worker: process.pid
                };
            }
        }
    }
});

// Register plugins
fastify.register(cors);

// Add worker ID to all responses
fastify.addHook('preHandler', async (request, reply) => {
    reply.header('X-Worker-Id', process.pid);
});


// Register routes
fastify.register(cartRouter);
fastify.register(orderRouter);

// Health check endpoint
fastify.get('/health', async () => {
    return {
        status: 'ok',
        worker: process.pid,
        timestamp: new Date().toISOString()
    };
});

export default fastify;