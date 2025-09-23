import express from "express";
import { backtest } from "../controllers/backtestController.js";

const router = express.Router();

router.post("/", backtest);

export default router;
