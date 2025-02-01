import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository"
import { ValidateRequest } from "../utils/validator";
import { CartResponseSchema, CartRequestSchema, CardEditRequestInput} from "../interfaces/schemas/cartSchema";


const repo = repository.CartResitory
export const cartRouter = async (fastify: FastifyInstance)=>{

    const option =  {
        schema: {
          body: CartRequestSchema,
          response: {
            200: CartResponseSchema,
          },
        },
      };
      
    fastify.post("/cart", option, async (req: FastifyRequest, res: FastifyReply)=>{
        try {
           
            console.log(req.body)
            const response = await service.CreateCart(req.body as CardEditRequestInput, repo);
       
            return res.status(200).send(response);
        } catch (error) {

            console.error(error);
            fastify.log.error(error)
            return res.status(500).send({ error: 'Internal Server Error'+error });
        }
    } );


    fastify.get("/cart", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const response = await service.GetCart(req.body, repo);
       
           
            return res.status(200).send(response);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );

    fastify.patch("/cart", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const response = await service.EditCart(req.body, repo);
       
           
            return res.status(200).send(response);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );
    fastify.delete("/cart", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const response = await service.DeleteCart(req.body, repo);
       
           
            return res.status(200).send(response);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );

}