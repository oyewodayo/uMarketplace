import { FastifyRequest, FastifyReply } from "fastify";
import { ValidateUser } from "../utils/broker/api";

export const RequestAuthorizer = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  console.log("RequestAuthorizer called", req.headers.authorization);
  try {
    if (!req.headers.authorization) {
      return res
        .status(403)
        .send({ error: "Unauthorized due to authorization token missing!" });
    }
    const userData = await ValidateUser(req.headers.authorization as string);
    req.user = userData; 
  } catch (error) {
    console.log("error", error);
    return res.status(403).send({ error });
  }
};
