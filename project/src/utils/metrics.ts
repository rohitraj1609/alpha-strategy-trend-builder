import { OHLCV, Signal, StrategyResult } from '../types/trading';
import { calculateSharpeRatio } from './indicators';

export function calculateMetrics(data: OHLCV[], signals: Signal[]): StrategyResult['metrics'] {
  // Calculate returns and performance metrics
  const returns: number[] = [];
  let equity = 1;
  let peak = 1;
  let maxDrawdown = 0;
  let position = 0;
  let wins = 0;

  for (let i = 1; i < signals.length; i += 2) {
    if (i + 1 >= signals.length) break;
    
    const entry = signals[i];
    const exit = signals[i + 1];
    const returnPct = (exit.price - entry.price) / entry.price;
    
    returns.push(returnPct);
    equity *= (1 + returnPct);
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, (peak - equity) / peak);
    
    if (returnPct > 0) wins++;
  }

  const totalReturn = equity - 1;
  const winRate = signals.length >= 2 ? wins / (signals.length / 2) : 0;
  const sharpeRatio = calculateSharpeRatio(returns);

  return {
    sharpeRatio,
    maxDrawdown,
    totalReturn,
    winRate
  };
}