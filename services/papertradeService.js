import { getLivePrice } from "./dataService.js";
import { runSMA, runRSI, runBollinger } from "./strategyService.js";

let portfolio = { cash: 100000, positions: [], equity: 100000 };

export async function runPaperTrade(symbol, strategy, capital, params) {
  const live = await getLivePrice(symbol);
  const price = live.price;

  // Reuse strategy logic to decide BUY/SELL
  let signals = [];
  switch (strategy) {
    case "sma":
      signals = await runSMA(
        symbol,
        params.shortWindow || 20,
        params.longWindow || 50
      );
      break;
    case "rsi":
      signals = await runRSI(symbol, params.period || 14);
      break;
    case "bollinger":
      signals = await runBollinger(symbol, params.window || 20);
      break;
  }

  const lastSignal = signals.at(-1);
  if (!lastSignal) return portfolio;

  if (lastSignal.signal === "BUY" && portfolio.cash > price) {
    const qty = Math.floor(portfolio.cash / price);
    portfolio.positions.push({ symbol, qty, avgPrice: price });
    portfolio.cash -= qty * price;
  } else if (lastSignal.signal === "SELL") {
    const position = portfolio.positions.find((p) => p.symbol === symbol);
    if (position) {
      portfolio.cash += position.qty * price;
      portfolio.positions = portfolio.positions.filter(
        (p) => p.symbol !== symbol
      );
    }
  }

  portfolio.equity =
    portfolio.cash +
    portfolio.positions.reduce((sum, p) => sum + p.qty * price, 0);
  return portfolio;
}
