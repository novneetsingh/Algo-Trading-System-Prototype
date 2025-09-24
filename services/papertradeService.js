import { getSignals } from "./strategyService.js";
import { getLivePrice } from "./dataService.js";
import ErrorResponse from "../utils/errorResponse.js";
import { getPortfolio, buyPosition, sellPosition } from "./portfolioService.js";

export async function runPaperTrade(
  userName,
  symbol,
  strategy,
  smaShortWindow,
  smaLongWindow,
  rsiPeriod
) {
  const signals = await getSignals(
    symbol,
    strategy,
    smaShortWindow,
    smaLongWindow,
    rsiPeriod
  );

  const latestSignal = signals.at(-1);
  if (!latestSignal) {
    throw new ErrorResponse("No signals generated for this symbol", 400);
  }

  // get live price of symbol
  const currentPrice = (await getLivePrice(symbol)).regularMarketPrice;

  // get user's portfolio
  const portfolio = await getPortfolio(userName);

  // check if portfolio exists
  if (!portfolio) {
    throw new ErrorResponse("Portfolio not found", 404);
  }

  // sell or buy all available positions
  if (latestSignal.signal === "BUY") {
    if (portfolio.currentCapital < currentPrice) {
      throw new ErrorResponse("Not enough capital to buy", 400);
    }

    const quantity = Math.floor(portfolio.currentCapital / currentPrice);
    await buyPosition(portfolio.id, symbol, quantity, currentPrice);
  } else if (latestSignal.signal === "SELL") {
    // get this symbol's position
    const position = portfolio.positions.find(
      (position) => position.symbol === symbol
    );

    if (!position || position.quantity === 0) {
      throw new ErrorResponse("No positions to sell", 400);
    }

    await sellPosition(portfolio.id, symbol, position.quantity, currentPrice);
  }
}
