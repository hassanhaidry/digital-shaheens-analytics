import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AgencyProfitData, DateRange } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { format } from 'date-fns';

interface ProfitOverviewProps {
  data?: AgencyProfitData;
  dateRange: DateRange;
}

const ProfitOverview: React.FC<ProfitOverviewProps> = ({ data, dateRange }) => {
  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No profit data available</p>
      </div>
    );
  }

  const dateRangeStr = `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Agency Profit */}
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <i className="fas fa-dollar-sign mb-2"></i>
          <h4 className="text-sm mb-1">Total Agency Profit</h4>
          <p className="text-2xl font-bold mb-1">{formatCurrency(data.total)}</p>
          <p className="text-xs">{dateRangeStr}</p>
        </div>
        
        {/* Total Stores */}
        <div className="bg-blue-500 rounded-lg p-4 text-white">
          <i className="fas fa-store mb-2"></i>
          <h4 className="text-sm mb-1">Total Stores</h4>
          <p className="text-2xl font-bold mb-1">{data.totalStores}</p>
          <p className="text-xs">{data.totalStores} with profit share settings</p>
        </div>
        
        {/* Total Revenue */}
        <div className="bg-purple-500 rounded-lg p-4 text-white">
          <i className="fas fa-chart-line mb-2"></i>
          <h4 className="text-sm mb-1">Total Revenue</h4>
          <p className="text-2xl font-bold mb-1">{formatCurrency(data.totalRevenue)}</p>
          <p className="text-xs">Across all stores</p>
        </div>
        
        {/* Avg. Profit Share */}
        <div className="bg-red-500 rounded-lg p-4 text-white">
          <i className="fas fa-percentage mb-2"></i>
          <h4 className="text-sm mb-1">Avg. Profit Share</h4>
          <p className="text-2xl font-bold mb-1">{formatPercentage(data.avgProfitShare)}</p>
          <p className="text-xs">Average across all stores</p>
        </div>
      </div>

      {/* Profit Breakdown Table */}
      <Card className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h4 className="text-gray-800 font-medium">Store Profit Breakdown</h4>
          <p className="text-gray-500 text-sm">{dateRangeStr}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left">Store</th>
                <th className="px-6 py-3 text-right">Revenue</th>
                <th className="px-6 py-3 text-right">Costs</th>
                <th className="px-6 py-3 text-right">Net Profit</th>
                <th className="px-6 py-3 text-right">Profit Share %</th>
                <th className="px-6 py-3 text-right">Agency Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.storeProfitBreakdown.map((store) => (
                <tr key={store.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-md mr-2">
                        <i className="fas fa-store text-blue-500"></i>
                      </div>
                      <span>{store.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">{formatCurrency(store.revenue)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(store.costs)}</td>
                  <td className="px-6 py-4 text-right text-green-600">{formatCurrency(store.netProfit)}</td>
                  <td className="px-6 py-4 text-right">{formatPercentage(store.profitSharePercentage)}</td>
                  <td className="px-6 py-4 text-right text-primary font-medium">{formatCurrency(store.agencyProfit)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4 text-right">{formatCurrency(data.totalRevenue)}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(data.storeProfitBreakdown.reduce((acc, store) => acc + store.costs, 0))}</td>
                <td className="px-6 py-4 text-right text-green-600">{formatCurrency(data.storeProfitBreakdown.reduce((acc, store) => acc + store.netProfit, 0))}</td>
                <td className="px-6 py-4 text-right">-</td>
                <td className="px-6 py-4 text-right text-primary font-medium">{formatCurrency(data.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProfitOverview;
