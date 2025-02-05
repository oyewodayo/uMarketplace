// models/User.Model.ts
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}

export interface User {
  id: number;
  email: string;
  iat: number;
  exp: number;
}
