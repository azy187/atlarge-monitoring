import { Response, Request } from "express";
import pool from "@monitoring/db/pool";

const getData = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const response = await client.query("SELECT * FROM test_history");
    const { rows } = response;
    res.json(rows);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
};

export default getData;
