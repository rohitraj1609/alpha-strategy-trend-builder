export const calculateSharpeRatio = (profitLossArray: number[]): number => {
  if (profitLossArray.length === 0) return 0;
  
  const mean = profitLossArray.reduce((sum, val) => sum + val, 0) / profitLossArray.length;
  
  const variance = profitLossArray.reduce((sum, val) => {
    const diff = val - mean;
    return sum + (diff * diff);
  }, 0) / profitLossArray.length;
  
  const stdDev = Math.sqrt(variance);
  
  // Avoid division by zero
  return stdDev === 0 ? 0 : mean / stdDev;
};