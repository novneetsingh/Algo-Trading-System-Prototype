import { runSMA, runRSI } from "../services/strategyService.js";
import ErrorResponse from "../utils/errorResponse.js";

// Run a strategy (SMA, RSI)
export async function runStrategy(req, res) {
  const { symbol, strategy, smaShortWindow, smaLongWindow, rsiPeriod } =
    req.body;

  if (!symbol || !strategy) {
    throw new ErrorResponse("Symbol and strategy are required", 400);
  }

  let signals = [];

  if (strategy === "sma") {
    signals = await runSMA(symbol, smaShortWindow || 20, smaLongWindow || 50);
  } else if (strategy === "rsi") {
    signals = await runRSI(symbol, rsiPeriod || 14);
  } else {
    throw new ErrorResponse("Invalid strategy", 400);
  }

  res.status(200).json({
    success: signals.length > 0 ? true : false,
    message:
      signals.length > 0
        ? "Strategy executed successfully"
        : "No signals generated",
    symbol: symbol,
    strategy: strategy,
    data: signals,
  });
}
