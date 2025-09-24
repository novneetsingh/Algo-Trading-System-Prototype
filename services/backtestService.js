import { getSignals } from "./strategyService.js";
import ErrorResponse from "../utils/errorResponse.js";

export async function backtestStrategy(
  symbol,
  strategy,
  capital,
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

  // Check if signals are generated
  if (!signals.length) {
    throw new ErrorResponse("No signals generated for this symbol", 400);
  }

  let cash = capital, // initial capital
    position = 0, // number of shares held
    trades = []; // array of trades handled

  for (const sig of signals) {
    if (sig.signal === "BUY" && cash > sig.price) {
      // calculate the number of shares can be bought
      position = Math.floor(cash / sig.price);
      cash -= position * sig.price;
      trades.push({ ...sig, qty: position });
    } else if (sig.signal === "SELL" && position > 0) {
      // increase the cash and reduce the position
      cash += position * sig.price;
      trades.push({ ...sig, qty: position });
      position = 0;
    }
  }

  // calculate the final equity
  // if position is positive then buy the last signal price with position
  const finalEquity =
    cash + (position > 0 ? position * signals.at(-1).price : 0);

  return { finalEquity, PnL: finalEquity - capital, trades };
}
