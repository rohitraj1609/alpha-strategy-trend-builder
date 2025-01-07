import { BollingerBands } from './types';
import { calculateSMA } from './moving-averages';

export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): BollingerBands {
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