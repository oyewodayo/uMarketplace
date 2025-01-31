import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository"
import { ValidateRequest } from "../utils/validator";
import { CardEditRequestInput, CartRequestSchema } from "../dto/cardRequest.do";


const repo = repository.CartResitory
export const cartRouter = async (fastify: FastifyInstance)=>{
    fastify.post("/cart", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const error  = ValidateRequest<CardEditRequestInput>(
                req.body,
                CartRequestSchema
            )

            if (error) {
                return res.status(404).send(error);
            }
            const response = await service.CreateCart(req.body as CardEditRequestInput, repo);
       
            return res.status(200).send(response);
        } catch (error) {

            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
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