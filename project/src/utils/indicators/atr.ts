import { OHLCV } from '../../types/trading';

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