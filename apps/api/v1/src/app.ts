import express from "express";
import { errorHandler } from "./middleware";
import router from "./router";

const app = express();

app.get("/", (req, res) => {
  res.json({ path: "./" });
});

app.use("/v1/", router);
app.use(errorHandler);

export default app;
