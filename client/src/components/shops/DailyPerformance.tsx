import React from 'react';
import { DailyMetric } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface DailyPerformanceProps {
  dailyData: DailyMetric[];
}

const DailyPerformance: React.FC<DailyPerformanceProps> = ({ dailyData }) => {
  if (!dailyData || dailyData.length === 0) {
    return (
      <div>
        <h4 className="text-white mb-3">Daily Performance (Last 7 Days)</h4>
        <div className="bg-primary-dark bg-opacity-30 rounded-lg p-4 text-center">
          <p className="text-blue-200">No daily performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-white mb-3">Daily Performance (Last 7 Days)</h4>
      <div className="bg-primary-dark bg-opacity-30 rounded-lg overflow-hidden">
        <table className="w-full text-white">
          <thead>
            <tr className="text-blue-200 text-xs text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Profit</th>
              <th className="p-3">ROI</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map((day, index) => (
              <tr key={index} className="border-t border-primary-light border-opacity-20">
                <td className="p-3">{day.date}</td>
                <td className="p-3">{formatCurrency(day.revenue)}</td>
                <td className="p-3">{day.orders}</td>
                <td className="p-3">{formatCurrency(day.cost)}</td>
                <td className="p-3">{formatCurrency(day.profit)}</td>
                <td className="p-3">{formatPercentage(day.roi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyPerformance;
