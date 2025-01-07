import React from 'react';
import { StrategyResult } from '../types/trading';
import { TrendingUp, TrendingDown, Percent, Target } from 'lucide-react';

interface MetricsProps {
  metrics: StrategyResult['metrics'];
}

export function Metrics({ metrics }: MetricsProps) {
  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Sharpe Ratio</span>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold mt-2">{metrics.sharpeRatio.toFixed(2)}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Max Drawdown</span>
          <TrendingDown className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-2xl font-bold mt-2">{formatPercent(metrics.maxDrawdown)}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total Return</span>
          <Percent className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold mt-2">{formatPercent(metrics.totalReturn)}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Win Rate</span>
          <Target className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-2xl font-bold mt-2">{formatPercent(metrics.winRate)}</p>
      </div>
    </div>
  );
}