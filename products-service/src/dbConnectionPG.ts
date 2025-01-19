import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

let client: Pool | undefined;

export const pgClient = (): Pool => {
    if (!client) {
        client = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "5432"),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
    }
    return client;
};
