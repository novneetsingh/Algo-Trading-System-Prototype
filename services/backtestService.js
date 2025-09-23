import { runSMA, runRSI, runBollinger } from "./strategyService.js";

export async function backtestStrategy(symbol, strategy, capital, params) {
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
    default:
      throw new Error("Invalid strategy");
  }

  let cash = capital,
    position = 0,
    trades = [];

  for (const sig of signals) {
    if (sig.signal === "BUY" && cash > sig.price) {
      position = Math.floor(cash / sig.price);
      cash -= position * sig.price;
      trades.push({ ...sig, qty: position });
    } else if (sig.signal === "SELL" && position > 0) {
      cash += position * sig.price;
      trades.push({ ...sig, qty: position });
      position = 0;
    }
  }

  const finalEquity =
    cash + (position > 0 ? position * signals.at(-1).price : 0);

  return { trades, pnl: finalEquity - capital, finalEquity };
}
