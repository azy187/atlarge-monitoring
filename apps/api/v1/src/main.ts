import app from "./app";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

app.listen(process.env.API_PORT, () => {
  const started = new Date().toLocaleTimeString();
  console.log(`[${started}] API running on port ${process.env.API_PORT}`);
});
