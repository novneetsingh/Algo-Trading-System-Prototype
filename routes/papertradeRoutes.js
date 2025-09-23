import express from "express";
import { paperTrade } from "../controllers/papertradeController.js";

const router = express.Router();

router.post("/", paperTrade);

export default router;
