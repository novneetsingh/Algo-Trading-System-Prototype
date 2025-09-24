import express from "express";
import {
  createPapertradePortfolio,
  addCapitalToPortfolio,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.post("/", createPapertradePortfolio);
router.patch("/addCapital", addCapitalToPortfolio);

export default router;
