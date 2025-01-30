import cluster from 'cluster';
import os from 'os';
import { startServer } from './index';
import { Worker } from 'cluster';
import fastify from './fastify-app'; 

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    // Master process
    console.log(`Master process ${process.pid} is running`);
    console.log(`Number of CPUs: ${numCPUs}`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Handle worker failures
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
        cluster.fork();
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('Shutting down cluster...');
        // Fix for Object.values(cluster.workers)
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
    console.log(`Worker ${process.pid} started`);
    startServer();

    // Handle graceful shutdown
    process.on('message', async (msg) => {
        if (msg === 'shutdown') {
            try {
                await fastify.close();
                process.exit(0);
            } catch (err) {
                console.error('Error during shutdown:', err);
                process.exit(1);
            }
        }
    });
}