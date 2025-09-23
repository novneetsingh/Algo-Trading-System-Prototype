import { backtestStrategy } from "../services/backtestService.js";

// Run backtest for a given strategy
export async function backtest(req, res, next) {
  try {
    const { symbol, strategy, capital, params } = req.body;

    if (!symbol || !strategy) {
      return res
        .status(400)
        .json({ error: "Symbol and strategy are required" });
    }

    const results = await backtestStrategy(
      symbol,
      strategy,
      capital || 100000,
      params || {}
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
}
