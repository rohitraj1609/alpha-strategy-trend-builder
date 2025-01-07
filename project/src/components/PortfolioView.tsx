import React from 'react';
import { Portfolio, PortfolioMetrics } from '../types/portfolio';
import { Wallet, TrendingUp, BarChart2, History } from 'lucide-react';

interface PortfolioViewProps {
  portfolio: Portfolio;
  metrics: PortfolioMetrics;
}

export function PortfolioView({ portfolio, metrics }: PortfolioViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Cash</span>
            <Wallet className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">${portfolio.cash.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total P&L</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">${metrics.totalPnl.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Open Positions</span>
            <BarChart2 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.openPositions}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Trades</span>
            <History className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.totalTrades}</p>
        </div>
      </div>

      {portfolio.positions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Open Positions</h3>
          <div className="space-y-4">
            {portfolio.positions.map((position, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{position.symbol}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {position.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${position.entryPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(position.entryTimestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}