import app from "./app";
import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.API_PORT, () => {
  const started = new Date().toLocaleTimeString();
  console.log(
    `[${started}] Express API running on port ${process.env.API_PORT}`
  );
});
