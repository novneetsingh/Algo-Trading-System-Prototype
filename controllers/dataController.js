import { getHistoricalData, getLivePrice } from "../services/dataService.js";
import ErrorResponse from "../utils/errorResponse.js";

// Fetch historical stock data
export async function getHistorical(req, res, next) {
  const { symbol } = req.params;
  const { start, end } = req.query;

  if (!symbol) {
    throw new ErrorResponse("Symbol is required", 400);
  }

  if (!start || !end) {
    throw new ErrorResponse("Start and end dates are required", 400);
  }

  const data = await getHistoricalData(symbol, start, end);
  res.json(data);
}

// Fetch live stock price
export async function getLive(req, res, next) {
  const { symbol } = req.params;

  if (!symbol) {
    throw new ErrorResponse("Symbol is required", 400);
  }

  const price = await getLivePrice(symbol);
  res.json(price);
}
