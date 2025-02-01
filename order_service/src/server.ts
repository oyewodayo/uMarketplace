import cluster from 'cluster';
import os from 'os';
import { startServer } from './index';
import { Worker } from 'cluster';
import fastify from './fastify-app'; 

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    // Master process
    fastify.log.info(`Master process ${process.pid} is running`);
    fastify.log.info(`Number of CPUs: ${numCPUs}`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Handle worker failures
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        fastify.log.info(`Worker ${worker.process.pid} died. Starting a new worker...`);
        cluster.fork();
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        fastify.log.info('Shutting down cluster...');
       
        if (cluster.workers) {
            Object.values(cluster.workers).forEach((worker) => {
                if (worker) {
                    worker.send('shutdown');
                }
            });
        }
    });
} else {
    // Worker process
    fastify.log.info(`Worker ${process.pid} started`);
    startServer();

    // Handle graceful shutdown
    process.on('message', async (msg) => {
        if (msg === 'shutdown') {
            try {
                await fastify.close();
                process.exit(0);
            } catch (err) {
                fastify.log.error('Error during shutdown:', err);
                process.exit(1);
            }
        }
    });
}