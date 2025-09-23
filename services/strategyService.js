import { getHistoricalData } from "./dataService.js";

// Helper: Simple Moving Average
function movingAverage(data, window) {
  return data.map((_, idx, arr) => {
    if (idx < window) return null;
    const slice = arr.slice(idx - window, idx);
    return slice.reduce((sum, d) => sum + d.close, 0) / window;
  });
}

// 1️⃣ Moving Average Crossover
export async function runSMA(symbol, shortWindow, longWindow) {
  const data = await getHistoricalData(symbol);
  if (data.length < longWindow) throw new Error("Not enough data");

  const shortMA = movingAverage(data, shortWindow);
  const longMA = movingAverage(data, longWindow);

  let signals = [];
  for (let i = longWindow; i < data.length; i++) {
    if (shortMA[i] > longMA[i] && shortMA[i - 1] <= longMA[i - 1]) {
      signals.push({ date: data[i].date, signal: "BUY", price: data[i].close });
    } else if (shortMA[i] < longMA[i] && shortMA[i - 1] >= longMA[i - 1]) {
      signals.push({
        date: data[i].date,
        signal: "SELL",
        price: data[i].close,
      });
    }
  }
  return signals;
}

// 2️⃣ RSI Momentum
export async function runRSI(symbol, period = 14) {
  const data = await getHistoricalData(symbol);
  if (data.length < period) throw new Error("Not enough data");

  const closes = data.map((d) => d.close);
  let gains = [],
    losses = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let signals = [];
  for (let i = period; i < closes.length; i++) {
    const avgGain =
      gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const avgLoss =
      losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

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
