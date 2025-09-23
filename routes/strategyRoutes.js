import express from "express";
import { runStrategy } from "../controllers/strategyController.js";

const router = express.Router();

router.post("/run", runStrategy);

export default router;
