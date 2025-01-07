import { OHLCV } from '../types/trading';

export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
      continue;
    }
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

export function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    gains.push(Math.max(difference, 0));
    losses.push(Math.max(-difference, 0));
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(NaN);
      continue;
    }

    const rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));

    if (i < prices.length - 1) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    }
  }

  return rsi;
}

export function calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2): {
  upper: number[];
  middle: number[];
  lower: number[];
} {
  const middle = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }

    const slice = prices.slice(i - period + 1, i + 1);
    const avg = middle[i];
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    upper.push(avg + (stdDev * standardDeviation));
    lower.push(avg - (stdDev * standardDeviation));
  }

  return { upper, middle, lower };
}

export function calculateATR(data: OHLCV[], period: number = 14): number[] {
  const tr: number[] = [];
  const atr: number[] = [];

  // Calculate True Range
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      tr.push(data[i].high - data[i].low);
    } else {
      const hl = data[i].high - data[i].low;
      const hc = Math.abs(data[i].high - data[i - 1].close);
      const lc = Math.abs(data[i].low - data[i - 1].close);
      tr.push(Math.max(hl, hc, lc));
    }
  }

  // Calculate ATR
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      atr.push(NaN);
      continue;
    }
    const prevATR = i === period ? tr.slice(0, period).reduce((a, b) => a + b, 0) / period : atr[i - 1];
    atr.push((prevATR * (period - 1) + tr[i]) / period);
  }

  return atr;
}

export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.07): number {
  const excessReturns = returns.map(r => r - riskFreeRate / 252);
  const meanExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
  const stdDev = Math.sqrt(
    excessReturns.reduce((a, b) => a + Math.pow(b - meanExcessReturn, 2), 0) / (excessReturns.length - 1)
  );
  return (meanExcessReturn / stdDev) * Math.sqrt(252);
}