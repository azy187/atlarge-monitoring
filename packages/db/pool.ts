import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const config: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
};

const pool = new Pool(config);

export default pool;
