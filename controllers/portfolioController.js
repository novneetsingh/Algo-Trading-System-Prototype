import { createPortfolio, addCapital } from "../services/portfolioService.js";
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
