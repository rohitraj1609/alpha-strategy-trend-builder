import { CSVData } from '../types/csv';
import { Trade } from '../types/trading';
import { analyzeTechnicals } from './marketAnalysis';
import { identifyMarketCondition } from './marketAnalysis';
import { selectAndExecuteStrategy } from './strategySelector';

export const analyzeAndTrade = (symbol: string, data: CSVData[]): Trade[] => {
  const trades: Trade[] = [];
  const windowSize = 200; // Analysis window
  
  for (let i = windowSize; i < data.length; i++) {
    const windowData = data.slice(i - windowSize, i);
    const indicators = analyzeTechnicals(windowData);
    const marketCondition = identifyMarketCondition(indicators);
    
    const trade = selectAndExecuteStrategy(
      symbol,
      windowData,
      marketCondition,
      indicators
    );
    
    if (trade) {
      trades.push(trade);
      i += 60; // Skip next hour after taking a trade
    }
  }
  
  return trades;
};

export const exportToCsv = (trades: Trade[]): string => {
  const headers = [
    'name',
    'Entry datetime',
    'Entry_price',
    'Stoploss_level',
    'Target_level',
    'Exit datetime',
    'Holding_Period',
    'Trade Result'
  ].join(',');
  
  const rows = trades.map(trade => [
    trade.name,
    trade.entryDateTime,
    trade.entryPrice.toFixed(2),
    trade.stopLossLevel.toFixed(2),
    trade.targetLevel.toFixed(2),
    trade.exitDateTime,
    trade.holdingPeriod,
    trade.tradeResult
  ].join(','));
  
  return [headers, ...rows].join('\n');
};