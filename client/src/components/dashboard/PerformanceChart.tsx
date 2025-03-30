import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface PerformanceChartProps {
  data?: {
    date: string;
    revenue: number;
    orders: number;
    profit: number;
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-green-500">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-blue-500">
            Orders: {payload[1].value}
          </p>
          <p className="text-sm text-red-500">
            Profit: {formatCurrency(payload[2].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" tickFormatter={formatYAxis} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => value} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name="Revenue"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Orders"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="profit"
            stroke="#ef4444"
            strokeWidth={2}
            name="Profit"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
