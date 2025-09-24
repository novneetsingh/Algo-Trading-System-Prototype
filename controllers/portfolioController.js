import { getLivePrice } from "../services/dataService.js";
import {
  createPortfolio,
  addCapital,
  getPortfolio,
} from "../services/portfolioService.js";
import ErrorResponse from "../utils/errorResponse.js";

// create a papertrade portfolio
export const createPapertradePortfolio = async (req, res) => {
  const { userName, initialCapital } = req.body;

  if (!userName) {
    throw new ErrorResponse("Please provide a user name", 400);
  }

  const portfolio = await createPortfolio(userName, initialCapital);

  res.status(201).json({
    success: portfolio ? true : false,
    message: portfolio
      ? "Portfolio created successfully"
      : "Failed to create portfolio",
    data: portfolio ?? null,
  });
};

// add capital to a portfolio
export const addCapitalToPortfolio = async (req, res) => {
  const { userName, amount } = req.body;

  if (!userName || !amount) {
    throw new ErrorResponse("Please provide user name and amount", 400);
  }

  if (amount <= 0) {
    throw new ErrorResponse("Amount must be greater than 0", 400);
  }

  const portfolio = await addCapital(userName, amount);

  res.status(200).json({
    success: portfolio ? true : false,
    message: portfolio ? "Capital added successfully" : "Failed to add capital",
    data: portfolio ?? null,
  });
};

// get detailed portfolio details
export const getPortfolioDetails = async (req, res) => {
  const { userName } = req.params;

  const portfolio = await getPortfolio(userName);

  if (!portfolio) {
    throw new ErrorResponse("Portfolio not found", 404);
  }

  // calculate current position live value
  let totalPositionValue = 0;
  for (const position of portfolio.positions) {
    const livePrice = (await getLivePrice(position.symbol)).regularMarketPrice;
    totalPositionValue += position.quantity * livePrice;
  }

  // calculate PnL
  const PnL =
    totalPositionValue - (portfolio.initialCapital - portfolio.currentCapital);

  res.status(200).json({
    success: portfolio ? true : false,
    message: portfolio
      ? "Portfolio details retrieved successfully"
      : "Failed to retrieve portfolio details",
    data: portfolio ? { totalPositionValue, PnL, ...portfolio } : null,
  });
};
