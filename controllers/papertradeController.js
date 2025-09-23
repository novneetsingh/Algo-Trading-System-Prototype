import { runPaperTrade } from "../services/papertradeService.js";

export async function paperTrade(req, res, next) {
  try {
    const { symbol, strategy, capital, params } = req.body;

    if (!symbol || !strategy) {
      return res
        .status(400)
        .json({ error: "Symbol and strategy are required" });
    }

    const portfolio = await runPaperTrade(
      symbol,
      strategy,
      capital || 100000,
      params || {}
    );
    res.json(portfolio);
  } catch (err) {
    next(err);
  }
}
