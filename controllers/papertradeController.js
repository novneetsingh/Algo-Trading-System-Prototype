import { runPaperTrade } from "../services/papertradeService.js";
import ErrorResponse from "../utils/errorResponse.js";

// run paper trade
export async function paperTrade(req, res) {
  const {
    userName,
    symbol,
    strategy,
    smaShortWindow,
    smaLongWindow,
    rsiPeriod,
  } = req.body;

  if (!userName || !symbol || !strategy) {
    throw new ErrorResponse("User name, symbol and strategy are required", 400);
  }

  await runPaperTrade(
    userName,
    symbol,
    strategy,
    smaShortWindow,
    smaLongWindow,
    rsiPeriod
  );

  res.status(200).json({
    success: true,
    message: "Paper trade completed successfully",
  });
}
