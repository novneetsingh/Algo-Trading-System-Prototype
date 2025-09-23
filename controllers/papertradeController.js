import { runPaperTrade } from "../services/papertradeService.js";
import ErrorResponse from "../utils/errorResponse.js";

export async function paperTrade(req, res) {
  const { symbol, strategy, smaShortWindow, smaLongWindow, rsiPeriod } =
    req.body;

  if (!symbol || !strategy) {
    throw new ErrorResponse("Symbol and strategy are required", 400);
  }

  const result = await runPaperTrade(
    symbol,
    strategy,
    smaShortWindow,
    smaLongWindow,
    rsiPeriod
  );

  res.status(200).json({
    success: result ? true : false,
    message: result
      ? "Paper trade completed successfully"
      : "Paper trade failed",
  });
}
