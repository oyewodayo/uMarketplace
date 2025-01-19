import dotenv from 'dotenv';
import { Client, types, DseClientOptions } from 'cassandra-driver';

dotenv.config();

let client: Client | null = null;

const defaultOptions: DseClientOptions = {
  contactPoints: [process.env.DB_HOST || 'localhost'],
  localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
  keyspace: process.env.DB_KEYSPACE,
  credentials: {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || ''
  },
  pooling: {
    coreConnectionsPerHost: {
      [types.distance.local]: 2,
      [types.distance.remote]: 1
    },
    maxRequestsPerConnection: 1024
  },
  socketOptions: {
    connectTimeout: 5000
  }
};


export const getScyllaClient = async (): Promise<Client> => {
  if (!client) {
    client = new Client(defaultOptions);
    
    try {
      await client.connect();
      console.log('Connected to ScyllaDB cluster');
    } catch (error) {
      console.error('Error connecting to ScyllaDB:', error);
      throw error;
    }
  }

  return client;
};

export const closeConnection = async (): Promise<void> => {
  if (client) {
    try {
      await client.shutdown();
      console.log('Disconnected from ScyllaDB cluster');
      client = null;  // Set to null instead of undefined
    } catch (error) {
      console.error('Error disconnecting from ScyllaDB:', error);
      throw error;
    }
  }
};