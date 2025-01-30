import { defineConfig } from "drizzle-kit";
import {DB_URL} from "./src/config"


export default defineConfig({
    dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
    schema: './src/db/schema/*',
    out: './src/db/migrations',
    dbCredentials: {       
        url:DB_URL as string
    },
    verbose: true,
    strict: true,
  });