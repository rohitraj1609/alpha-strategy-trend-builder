import React from 'react';
import { calculateMetrics } from '../utils/csvParser';
import type { CSVData } from '../types/csv';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

interface CompanyMetricsProps {
  symbol: string;
  data: CSVData[];
}

export default function CompanyMetrics({ symbol, data }: CompanyMetricsProps) {
  const { averageReturn, volatility, maxDrawdown } = calculateMetrics(data);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">{symbol} Metrics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Avg Return</p>
            <p className="text-lg font-semibold">{averageReturn.toFixed(2)}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <BarChart2 className="w-6 h-6 text-purple-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Volatility</p>
            <p className="text-lg font-semibold">{volatility.toFixed(2)}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <TrendingDown className="w-6 h-6 text-red-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Max Drawdown</p>
            <p className="text-lg font-semibold">{(maxDrawdown * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}