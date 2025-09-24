import { getHistoricalData } from "./dataService.js";
import ErrorResponse from "../utils/errorResponse.js";

// calculate moving average
function movingAverage(data, window) {
  let movingAverage = [];

  for (let i = window; i < data.length; i++) {
    const slice = data.slice(i - window, i);
    const avg = slice.reduce((sum, d) => sum + d.close, 0) / window;
    movingAverage.push(avg);
  }

  return movingAverage;
}

// 1️⃣ Moving Average Crossover (SMA/EMA)
export async function runSMA(symbol, shortWindow = 20, longWindow = 50) {
  // get historical data
  const data = await getHistoricalData(symbol);

  // check if enough data
  if (data.length < longWindow) {
    throw new ErrorResponse("Not enough data", 400);
  }

  const shortMA = movingAverage(data, shortWindow);
  const longMA = movingAverage(data, longWindow);

  let signals = [];

  for (let i = longWindow; i < data.length; i++) {
    // if short MA is greater than long MA and previous short MA is less than previous long MA
    if (shortMA[i] > longMA[i] && shortMA[i - 1] <= longMA[i - 1]) {
      signals.push({
        date: data[i].date,
        signal: "BUY",
        price: data[i].close,
        shortMA: shortMA[i],
        longMA: longMA[i],
      });
    }
    // if short MA is less than long MA and previous short MA is greater than previous long MA
    else if (shortMA[i] < longMA[i] && shortMA[i - 1] >= longMA[i - 1]) {
      signals.push({
        date: data[i].date,
        signal: "SELL",
        price: data[i].close,
        shortMA: shortMA[i],
        longMA: longMA[i],
      });
    }
  }

  return signals;
}

// 2️⃣ RSI (Relative Strength Index) momentum strategy
export async function runRSI(symbol, rsiPeriod = 14) {
  // get historical data
  const data = await getHistoricalData(symbol);

  // check if enough data
  if (data.length < rsiPeriod) {
    throw new ErrorResponse("Not enough data", 400);
  }

  // get closing prices
  const closes = data.map((d) => d.close);

  let gains = [],
    losses = [];

  // calculate gains and losses
  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let signals = [];

  for (let i = rsiPeriod; i < closes.length; i++) {
    const avgGain =
      gains.slice(i - rsiPeriod, i).reduce((sum, g) => sum + g, 0) / rsiPeriod;
    const avgLoss =
      losses.slice(i - rsiPeriod, i).reduce((sum, l) => sum + l, 0) / rsiPeriod;

    // calculate RS
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;

    // calculate RSI
    const rsi = 100 - 100 / (1 + rs);

    // generate signals
    if (rsi > 70)
      signals.push({
        date: data[i].date,
        signal: "SELL",
        price: closes[i],
        rsi,
      });
    else if (rsi < 30)
      signals.push({
        date: data[i].date,
        signal: "BUY",
        price: closes[i],
        rsi,
      });
  }

  return signals;
}

// run different strategies
export async function getSignals(
  symbol,
  strategy,
  smaShortWindow,
  smaLongWindow,
  rsiPeriod
) {
  if (strategy === "sma")
    return await runSMA(symbol, smaShortWindow, smaLongWindow);
  else if (strategy === "rsi") return await runRSI(symbol, rsiPeriod);
  else throw new ErrorResponse("Invalid strategy", 400);
}
