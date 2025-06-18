import fs from "fs";
import path from "path";
import { parsePendingReports } from "./utils/parser.functions";
import pool from "@monitoring/db/pool";
import dotenv from "dotenv";
import { ParsedReport } from "@monitoring/types/TestData";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// needs major refactoring
async function _test_parse() {
  // open connection pool
  const client = await pool.connect();
  try {
    // get reports
    const { rows } = await client.query(
      `SELECT * FROM ${process.env.POSTGRES_TEST_HISTORY_TABLE}`
    );
    const parsedReports = parsePendingReports(
      (rows.length ? rows.at(0).data : []) as ParsedReport[]
    );
    // insert into db
    await client.query({
      text: `
      INSERT INTO ${process.env.POSTGRES_TEST_HISTORY_TABLE} (id, data)
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `,
      values: [1, JSON.stringify(parsedReports, null, 2)],
    });
  } catch (e) {
    console.log("Error during parse.");
    console.log(e);
  } finally {
    console.log("Parse ended.");
    client.release();
  }
}

export default _test_parse;
