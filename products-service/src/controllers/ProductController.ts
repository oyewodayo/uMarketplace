import { FastifyRequest, FastifyReply } from 'fastify';
import { IProductInteractor } from '../interfaces/iProductInteractor';

// Define interface for query parameters
interface ProductQueryString {
  offset?: string;
  limit?: string;
}

// Define interface for params
interface ProductParams {
  id: number;
}

// Define interface for request body
interface UpdateStockBody {
  stock: number;
}

export class ProductController {
    private interactor: IProductInteractor;

    constructor(interactor: IProductInteractor) {
        this.interactor = interactor;
    }

    async onCreateProduct(req: FastifyRequest, res: FastifyReply) {
        try {
            const body = req.body;
            const data = await this.interactor.createProduct(body);

            return res.status(200).send(data);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }

    async onGetProducts(
        req: FastifyRequest<{
            Querystring: ProductQueryString
        }>,
        res: FastifyReply
    ) {
        try {
            const offset = parseInt(req.query.offset || '0', 10);
            const limit = parseInt(req.query.limit || '10', 10);

            const data = await this.interactor.getProducts(limit, offset);
            return res.status(200).send(data);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error'+error });
        }
    }

    async onUpdateStock(
        req: FastifyRequest<{
            Params: ProductParams;
            Body: UpdateStockBody;
        }>,
        res: FastifyReply
    ) {
        try {
            const { id } = req.params;
            const { stock } = req.body;

            const data = await this.interactor.updateStock(id, stock);
            return res.status(200).send(data);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }
}