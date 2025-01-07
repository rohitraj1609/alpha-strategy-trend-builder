import { MarketCondition, Trade, TechnicalIndicators } from '../types/trading';
import { CSVData } from '../types/csv';

const RISK_PERCENT = 0.02; // 2% risk per trade

export const selectAndExecuteStrategy = (
  symbol: string,
  data: CSVData[],
  condition: MarketCondition,
  indicators: TechnicalIndicators
): Trade | null => {
  const currentPrice = data[data.length - 1].Close;
  const atr = indicators.atr;
  
  switch (condition.trend) {
    case 'uptrend':
      return executeGoldenCrossStrategy(symbol, data, indicators);
    case 'volatile':
      return executeBreakoutStrategy(symbol, data, indicators);
    case 'sideways':
      return executeMeanReversionStrategy(symbol, data, indicators);
    default:
      return null;
  }
};

const executeGoldenCrossStrategy = (
  symbol: string,
  data: CSVData[],
  indicators: TechnicalIndicators
): Trade | null => {
  const currentPrice = data[data.length - 1].Close;
  const stopLoss = currentPrice - (indicators.atr * 2);
  const target = currentPrice + (indicators.atr * 3);
  
  if (indicators.rsi < 70 && indicators.sma20 > indicators.sma50) {
    return createTrade(symbol, data, currentPrice, stopLoss, target);
  }
  
  return null;
};

const executeBreakoutStrategy = (
  symbol: string,
  data: CSVData[],
  indicators: TechnicalIndicators
): Trade | null => {
  const currentPrice = data[data.length - 1].Close;
  const stopLoss = currentPrice - (indicators.atr * 1.5);
  const target = currentPrice + (indicators.atr * 2.5);
  
  if (currentPrice > indicators.bollingerUpper && indicators.adx > 25) {
    return createTrade(symbol, data, currentPrice, stopLoss, target);
  }
  
  return null;
};

const executeMeanReversionStrategy = (
  symbol: string,
  data: CSVData[],
  indicators: TechnicalIndicators
): Trade | null => {
  const currentPrice = data[data.length - 1].Close;
  const stopLoss = currentPrice - (indicators.atr * 1.2);
  const target = currentPrice + (indicators.atr * 1.8);
  
  if (indicators.rsi < 30 && currentPrice < indicators.bollingerLower) {
    return createTrade(symbol, data, currentPrice, stopLoss, target);
  }
  
  return null;
};

const createTrade = (
  symbol: string,
  data: CSVData[],
  entryPrice: number,
  stopLoss: number,
  target: number
): Trade => {
  const entryDate = new Date(data[data.length - 1].Date);
  const exitDate = new Date(entryDate);
  exitDate.setHours(exitDate.getHours() + 1);
  
  return {
    name: symbol,
    entryDateTime: entryDate.toISOString(),
    entryPrice,
    stopLossLevel: stopLoss,
    targetLevel: target,
    exitDateTime: exitDate.toISOString(),
    holdingPeriod: 60, // minutes
    tradeResult: 'Exit_other'
  };
};