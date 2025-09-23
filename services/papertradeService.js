import { runSMA, runRSI } from "./strategyService.js";
import { getLivePrice } from "./dataService.js";
import ErrorResponse from "../utils/errorResponse.js";

export async function runPaperTrade(
  symbol,
  strategy,
  smaShortWindow,
  smaLongWindow,
  rsiPeriod
) {
  let signals = [];

  if (strategy === "sma") {
    signals = await runSMA(symbol, smaShortWindow || 20, smaLongWindow || 50);
  } else if (strategy === "rsi") {
    signals = await runRSI(symbol, rsiPeriod || 14);
  } else {
    throw new ErrorResponse("Invalid strategy", 400);
  }

  const latestSignal = signals.at(-1);
  if (!latestSignal) {
    throw new ErrorResponse("No signals generated for this symbol", 400);
  }

  const live = await getLivePrice(symbol);
  const currentPrice = live.regularMarketPrice;

  if (latestSignal.signal === "BUY") {
  } else if (latestSignal.signal === "SELL") {
  }
}
