import { getHistoricalData, getLivePrice } from "../services/dataService.js";
import ErrorResponse from "../utils/errorResponse.js";

// Fetch historical stock data
export async function getHistorical(req, res) {
  const { symbol } = req.params;
  const { startDate, endDate } = req.query;

  if (!symbol) {
    throw new ErrorResponse("Symbol is required", 400);
  }

  const data = await getHistoricalData(symbol, startDate, endDate);

  res.status(200).json({
    success: data ? true : false,
    message: data ? "Data fetched successfully" : "No data found",
    count: data?.length || 0,
    symbol: symbol,
    data: data ?? null,
  });
}

// Fetch live stock price
export async function getLive(req, res) {
  const { symbol } = req.params;

  if (!symbol) {
    throw new ErrorResponse("Symbol is required", 400);
  }

  const price = await getLivePrice(symbol);

  res.status(200).json({
    success: price ? true : false,
    message: price ? "Data fetched successfully" : "No data found",
    data: price ?? null,
  });
}
