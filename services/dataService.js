import yahooFinance from "yahoo-finance2";

// Fetch historical OHLCV data
export async function getHistoricalData(symbol, start, end) {
  const queryOptions = {
    period1: start || "2023-01-01",
    period2: end || new Date().toISOString().split("T")[0],
  };
  return await yahooFinance.historical(symbol, queryOptions);
}

// Fetch current live price
export async function getLivePrice(symbol) {
  const result = await yahooFinance.quote(symbol);
  if (!result) throw new Error("No data found for symbol " + symbol);

  return {
    symbol: result.symbol,
    price: result.regularMarketPrice,
    time: result.regularMarketTime,
  };
}
