import { CartRepositoryType } from "../types/repository.type"
import * as Repository from "../repository/cart.repository"
import { CreateCart } from "./cart.service";


describe("cartService", ()=>{

    let repo: CartRepositoryType;
    beforeEach(()=>{

        repo = Repository.CartResitory;
    })

    afterEach(()=>{
        repo = {} as CartRepositoryType;
    })

    it("should return correct data when cart is created", async ()=>{
        const mockCart = {
            title: "Television",
            amount: 500000
        }

        jest.spyOn(Repository.CartResitory, "create").mockImplementationOnce(() =>
            Promise.resolve({
                message:"Cart created from repository",
                input:mockCart
            })
        )

        const res = await CreateCart(mockCart, repo);
        expect(res).toEqual({
            message:"Cart created from repository",
            input:mockCart
        })

    })
})