import fs from "fs";
import path from "path";
import { parsePendingReports } from "./utils/parser.functions";
import pool from "@monitoring/db/pool";
import dotenv from "dotenv";
import { ParsedReport } from "@monitoring/types/TestData";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function _test_parse() {
  console.log("3. _test_parse called");
  // open connection pool
  const client = await pool.connect();
  try {
    // attempt to get reports
    const historicalReports = await client.query(
      `SELECT 1 FROM ${process.env.POSTGRES_TEST_HISTORY_TABLE}`
    );
    const { rows } = historicalReports;

    rows.forEach((obj, i) => {
      console.log(`[${i}]: ${JSON.stringify(obj)}`);
    });
    // get the latest reports parsed combined with the historical reports
    const parsedReports = parsePendingReports(rows as ParsedReport[]);

    console.log(`historicalReports length: ${rows.length}`);
    console.log(`parsedReports length: ${parsedReports.length}`);

    // insert into db
    const res = await client.query({
      text: `
      INSERT INTO ${process.env.POSTGRES_TEST_HISTORY_TABLE} (id, data)
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `,
      values: [1, JSON.stringify(parsedReports, null, 2)],
    });

    console.log(`res: ${res}`);
  } catch (e) {
    console.log("_test_parse did error");
    console.log(e);
  } finally {
    console.log("_test_parse ended");
    client.release();
  }
}

export default _test_parse;
