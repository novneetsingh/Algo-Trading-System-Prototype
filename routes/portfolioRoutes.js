import express from "express";
import {
  createPapertradePortfolio,
  addCapitalToPortfolio,
  getPortfolioDetails,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.post("/", createPapertradePortfolio);
router.get("/:userName", getPortfolioDetails);
router.patch("/addCapital", addCapitalToPortfolio);

export default router;
