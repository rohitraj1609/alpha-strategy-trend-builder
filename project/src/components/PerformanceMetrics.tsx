import React from 'react';
import { calculateSharpeRatio, calculateTotalProfitLoss } from '../utils/calculations';
import type { Trade } from '../types/trading';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PerformanceMetricsProps {
  trades: Trade[];
}

export default function PerformanceMetrics({ trades }: PerformanceMetricsProps) {
  const sharpeRatio = calculateSharpeRatio(trades.map(t => t.profitLoss));
  const totalProfitLoss = calculateTotalProfitLoss(trades);
  const winRate = (trades.filter(t => t.profitLoss > 0).length / trades.length) * 100;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Sharpe Ratio</p>
            <p className="text-2xl font-semibold text-gray-900">{sharpeRatio.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          {totalProfitLoss >= 0 ? (
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
          ) : (
            <TrendingDown className="w-8 h-8 text-red-500 mr-3" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Total P/L</p>
            <p className={`text-2xl font-semibold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalProfitLoss.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-purple-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Win Rate</p>
            <p className="text-2xl font-semibold text-gray-900">{winRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}