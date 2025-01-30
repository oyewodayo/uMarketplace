import fastify from "./fastify-app"; // Ensure this exports a Fastify instance

const PORT = parseInt(process.env.PORT || '9000', 10);



fastify.get('/', async (request, reply) => {
    return { message: 'Welcome to the Order Service API' };
  });

// Function to start the server
export const startServer = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is up and running on port ${PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

// Start the server
startServer();