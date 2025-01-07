import React, { useMemo } from 'react';
import { OHLCV, Signal } from '../types/trading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, ResponsiveContainer } from 'recharts';
import { calculateSMA } from '../utils/indicators';

interface ChartProps {
  data: OHLCV[];
  signals: Signal[];
}

interface ChartData extends OHLCV {
  date: string;
  sma20?: number;
  sma50?: number;
}

export function Chart({ data, signals }: ChartProps) {
  const chartData = useMemo(() => {
    const closes = data.map(d => d.close);
    const sma20Values = calculateSMA(closes, 20);
    const sma50Values = calculateSMA(closes, 50);

    return data.map((d, i) => ({
      ...d,
      date: new Date(d.timestamp).toLocaleDateString(),
      sma20: sma20Values[i],
      sma50: sma50Values[i]
    }));
  }, [data]);

  const signalPoints = signals.map(signal => ({
    timestamp: signal.timestamp,
    price: signal.price,
    type: signal.type
  }));

  const domain = useMemo(() => {
    const prices = data.map(d => d.close);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.05;
    return [min - padding, max + padding];
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={domain}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            
            {/* Price Line */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="#2563eb"
              dot={false}
              name="Price"
            />
            
            {/* Moving Averages */}
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="#10b981"
              dot={false}
              strokeDasharray="5 5"
              name="SMA 20"
            />
            <Line
              type="monotone"
              dataKey="sma50"
              stroke="#f59e0b"
              dot={false}
              strokeDasharray="5 5"
              name="SMA 50"
            />

            {/* Trading Signals */}
            {signalPoints.map((point, index) => (
              <ReferenceDot
                key={index}
                x={new Date(point.timestamp).toLocaleDateString()}
                y={point.price}
                r={6}
                fill={point.type === 'ENTRY' ? '#22c55e' : '#ef4444'}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className="text-sm text-gray-600">Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-gray-600">SMA 20</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span className="text-sm text-gray-600">SMA 50</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Entry Signal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Exit Signal</span>
        </div>
      </div>
    </div>
  );
}