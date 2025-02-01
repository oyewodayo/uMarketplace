import fastify from "./fastify-app";

const PORT = parseInt(process.env.PORT || '9000', 10);

// Welcome route
fastify.get('/', async (request, reply) => {
    return { 
        message: 'Welcome to the Order Service API',
        worker: process.pid
    };
});

// Start server function
export const startServer = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        fastify.log.info(`Worker ${process.pid} is listening on port ${PORT}`);
    } catch (err) {
        fastify.log.error('Error starting server:', err);
        process.exit(1);
    }
};

// Only start the server if this file is run directly
if (require.main === module) {
    startServer();
}