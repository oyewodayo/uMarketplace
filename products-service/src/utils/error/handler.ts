import { FastifyRequest, FastifyReply } from 'fastify';
import {
   AuthorizeError,
   NotFoundError,
   ValidationError,
} from './errors';

export const HandleErrorWithLogger = (
   error: Error,
   req: FastifyRequest,
   res: FastifyReply,
) => {
   let reportError = true;
   let status = 500;
   let data = error.message;

   // skip common / known errors
   [NotFoundError, ValidationError, AuthorizeError].forEach(
      (typeOfError) => {
         if (error instanceof typeOfError) {
            reportError = false;
            status = error.status;
            data = error.message;
         }
      },
   );

   if (reportError) {
      // Use Fastify's logger to log the error
      req.log.error(error);
   } else {
      // Use Fastify's logger to log the warning
      req.log.warn(error); // ignore common errors caused by user
   }

   return res.status(status).send(data);
};

export const HandleUnCaughtException = async (
   error: Error,
   req: FastifyRequest, // Add req parameter to access Fastify's logger
) => {
   // Use Fastify's logger to log the error
   req.log.error(error);
   // recover
   process.exit(1);
};