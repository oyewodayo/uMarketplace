import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";




export const orderRouter = async (fastify: FastifyInstance)=>{
    fastify.post("/order", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const body = req.body;
       
            return res.status(200).send({message:"order created"});
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );
    fastify.get("/order", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const body = req.body;
       
            return res.status(200).send({message:"order created"});
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );
    fastify.get("/order/:id", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const body = req.body;
       
            return res.status(200).send({message:"order created"});
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );
    fastify.patch("/order", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const body = req.body;
       
            return res.status(200).send({message:"order updated"});
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );
    fastify.delete("/order/:id", async (req: FastifyRequest, res: FastifyReply)=>{
        try {
            const body = req.body;
       
            return res.status(200).send({message:"order deleted"});
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    } );

}