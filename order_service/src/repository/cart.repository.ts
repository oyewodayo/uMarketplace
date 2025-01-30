import { CartRepositoryType } from "../types/repository.type";

const createCart = async (input: any): Promise<{}> =>{

    return Promise.resolve({});
}
const findCart = async (input: any): Promise<{}> =>{

    return Promise.resolve({});
}
const updateCart = async (input: any): Promise<{}> =>{

    return Promise.resolve({});
}

const deleteCart = async (input: any): Promise<{}> =>{

    return Promise.resolve({});
}

export const CartResitory: CartRepositoryType = {
    create: createCart,
    find: findCart,
    update: updateCart,
    delete: deleteCart
}