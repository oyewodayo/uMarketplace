import Fastify from "fastify";
import cors from "@fastify/cors";
import { cartRouter } from "./routes/cart.routes";
import { orderRouter } from "./routes/order.routes";
import fastifyRateLimit from "@fastify/rate-limit";


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

fastify.register(cors);


fastify.register(fastifyRateLimit, {
    max: 80, 
    timeWindow: "1 minute"
});

// Add worker ID to all responses
fastify.addHook('preHandler', async (request, reply) => {
    reply.header('X-Worker-Id', process.pid);
});


fastify.register(cartRouter);
fastify.register(orderRouter);


fastify.get('/health', async () => {
    return {
        status: 'ok',
        worker: process.pid,
        timestamp: new Date().toISOString()
    };
});

export default fastify;