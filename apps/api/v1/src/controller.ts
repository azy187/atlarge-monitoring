import { Response, Request } from "express";
import dotenv from "dotenv";
import pool from "@monitoring/db/pool";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const getData = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const response = await client.query(
      `SELECT * FROM ${process.env.POSTGRES_TEST_HISTORY_TABLE}`
    );
    const { rows } = response;
    res.json(rows);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
};

export default getData;
