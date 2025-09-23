import yahooFinance from "yahoo-finance2";

// Fetch historical OHLCV data
export async function getHistoricalData(symbol, startDate, endDate) {
  const queryOptions = {
    period1: startDate || "2023-06-01",
    period2: endDate || new Date().toISOString().split("T")[0],
  };

  return (await yahooFinance.chart(symbol, queryOptions)).quotes;
}

// Fetch current live price
export async function getLivePrice(symbol) {
  return await yahooFinance.quote(symbol);
}
