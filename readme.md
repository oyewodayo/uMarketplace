Order Service and Product Service API with Node.js Clustering
A scalable microservice for handling orders, built with Fastify and utilizing Node.js clustering for improved performance.
Features

Multi-core processing using Node.js Clusters and Fastify
RESTful API built with Fastify
Order and Cart management
Database integration with Prisma and Drizzle
CORS enabled
Graceful shutdown handling

Prerequisites

Node.js (v14 or higher)
PostgreSQL
npm or yarn

# Clone the repository
git clone https://github.com/oyewodayo/uMarketplace.git

Navigate to each services before running the below code.

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations for Product service
npx prisma migrate dev

# Run database migrations for Order service
npm run db:generate
npm run db:push
npm run db:migrate

# Products
- GET 
