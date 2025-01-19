// Import the framework and instantiate it
import Fastify from 'fastify';
import { productRouter } from './routes/productRoutes'; // Import the productRoutes module

const fastify = Fastify({
  logger: true,
});


let port = 0;
// Declare a route
fastify.get('/', async function handler(request, reply) {
  const healthCheck = `Server running on port ${port}`;
  return { message: healthCheck };
});

// Register the product routes
fastify.register(productRouter); // Use the imported `app` as a Fastify plugin

// Run the server
const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    const address = fastify.server.address();  

    if (typeof address === 'object' && address !== null) {
      port = (address as { port: number }).port; // Extract the port
    }

    fastify.log.info(`Server is running at http://localhost:${port}`);
    console.log(`Server is running at http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
