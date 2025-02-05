import axios from "axios";
import { AuthorizeError, NotFoundError } from "../error/errors"

import { Product } from "../../models/Product";
import { User } from "../../models/User.Model";
import Fastify from "fastify";

const fastify = Fastify({
    logger: {
        level: 'trace',
        file: './log',
       
    }
});
const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:9001"; // env variable

const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9000";

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(
      `${CATALOG_BASE_URL}/products/${productId}`
    );
    return response.data as Product;
  } catch (error) {
    fastify.log.info(error)
    throw new NotFoundError("product not found");
  }
};

export const GetStockDetails = async (ids: number[]) => {
  try {
    const response = await axios.post(`${CATALOG_BASE_URL}/products/stock`, {
      ids,
    });
    return response.data as Product[];
  } catch (error) {
    fastify.log.error(error);
    throw new NotFoundError("error on getting stock details");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    console.log("ValidateUser called", token);
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`, {
      headers: {
        Authorization: token,
      },
    });

    console.log("response", response.data);

    if (response.status !== 200) {
      throw new AuthorizeError("user not authorised");
    }
    return response.data as User;
  } catch (error) {
    throw new AuthorizeError("user not authorised");
  }
};