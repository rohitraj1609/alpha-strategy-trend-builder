export const RISK_REWARD_RATIO = 2; // 2:1 risk-reward ratio

export function calculateStopLoss(entryPrice: number, atr: number): number {
  return entryPrice - atr;
}

export function calculateTakeProfit(entryPrice: number, atr: number): number {
  return entryPrice + (atr * RISK_REWARD_RATIO);
}