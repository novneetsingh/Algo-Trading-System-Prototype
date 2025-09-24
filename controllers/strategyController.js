import { getSignals } from "../services/strategyService.js";
import ErrorResponse from "../utils/errorResponse.js";

// Run a strategy (SMA, RSI)
export async function runStrategy(req, res) {
  const { symbol, strategy, smaShortWindow, smaLongWindow, rsiPeriod } =
    req.body;

  if (!symbol || !strategy) {
    throw new ErrorResponse("Symbol and strategy are required", 400);
  }

  const signals = await getSignals(
    symbol,
    strategy,
    smaShortWindow,
    smaLongWindow,
    rsiPeriod
  );

  res.status(200).json({
    success: signals ? true : false,
    message: signals
      ? "Strategy executed successfully"
      : "No signals generated for this symbol",
    symbol: symbol,
    strategy: strategy,
    data: signals,
  });
}
