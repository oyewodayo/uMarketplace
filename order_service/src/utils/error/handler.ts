import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Fastify from "fastify";
import {
   AuthorizeError,
   NotFoundError,
   ValidationError,
} from './errors';


const fastify = Fastify({
    logger: {
        level: 'trace',
        file: './log',
    }
});
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
      // error reporting tools implementation eg: Cloudwatch,Sentry etc;
      fastify.log.error(error);
   } else {
    fastify.log.warn(error); // ignore common errors caused by user
   }

   return res.status(status).send(data);
};

export const HandleUnCaughtException = async (
   error: Error,
) => {
   // error report / monitoring tools
   fastify.log.error(error);
   // recover
   process.exit(1);
};