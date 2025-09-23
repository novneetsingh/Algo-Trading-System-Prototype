import { backtestStrategy } from "../services/backtestService.js";
import ErrorResponse from "../utils/errorResponse.js";

// Run backtest for a given strategy
export async function backtest(req, res) {
  const {
    symbol,
    strategy,
    capital,
    smaShortWindow,
    smaLongWindow,
    rsiPeriod,
  } = req.body;

  if (!symbol || !strategy) {
    throw new ErrorResponse("Symbol and strategy are required", 400);
  }

  const results = await backtestStrategy(
    symbol,
    strategy,
    capital || 100000,
    smaShortWindow,
    smaLongWindow,
    rsiPeriod
  );

  res.status(200).json({
    success: results ? true : false,
    message: results ? "Backtest completed successfully" : "Backtest failed",
    data: results ?? null,
  });
}
