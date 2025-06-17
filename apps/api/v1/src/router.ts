import { Router } from "express";
import getData from "./controller";

const router = Router();

router.get("/", (req, res) => {
  res.json({ path: "./api/v1" });
});

router.get("/data", getData);

export default router;
