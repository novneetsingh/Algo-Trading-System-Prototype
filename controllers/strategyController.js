import { runSMA, runRSI, runBollinger } from "../services/strategyService.js";

// Run a strategy (SMA, RSI, Bollinger)
export async function runStrategy(req, res, next) {
  try {
    const { symbol, strategy, params } = req.body;

    if (!symbol || !strategy) {
      return res
        .status(400)
        .json({ error: "Symbol and strategy are required" });
    }

    let signals = [];
    switch (strategy) {
      case "sma":
        signals = await runSMA(
          symbol,
          params?.shortWindow || 20,
          params?.longWindow || 50
        );
        break;
      case "rsi":
        signals = await runRSI(symbol, params?.period || 14);
        break;
      case "bollinger":
        signals = await runBollinger(symbol, params?.window || 20);
        break;
      default:
        return res.status(400).json({ error: "Unknown strategy" });
    }

    res.json(signals);
  } catch (err) {
    next(err);
  }
}
