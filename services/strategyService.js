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
export async function runSMA(symbol, shortWindow, longWindow) {
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
export async function runRSI(symbol, period) {
  // get historical data
  const data = await getHistoricalData(symbol);

  // check if enough data
  if (data.length < period) {
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

  for (let i = period; i < closes.length; i++) {
    const avgGain =
      gains.slice(i - period, i).reduce((sum, g) => sum + g, 0) / period;
    const avgLoss =
      losses.slice(i - period, i).reduce((sum, l) => sum + l, 0) / period;

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

// 3️⃣ Bollinger Bands Mean Reversion
export async function runBollinger(symbol, window = 20) {
  const data = await getHistoricalData(symbol);
  if (data.length < window) throw new Error("Not enough data");

  let signals = [];
  for (let i = window; i < data.length; i++) {
    const slice = data.slice(i - window, i);
    const mean = slice.reduce((sum, d) => sum + d.close, 0) / window;
    const stdDev = Math.sqrt(
      slice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / window
    );

    const upper = mean + 2 * stdDev;
    const lower = mean - 2 * stdDev;
    const price = data[i].close;

    if (price < lower)
      signals.push({ date: data[i].date, signal: "BUY", price });
    else if (price > upper)
      signals.push({ date: data[i].date, signal: "SELL", price });
  }
  return signals;
}
