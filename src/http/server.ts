import Fastify from 'fastify';
import cors from '@fastify/cors';

export const server = Fastify({ logger: false });

// Register CORS for all origins
server.register(cors, {
  origin: true, // Allow all origins
});
