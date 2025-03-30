import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MetricData } from '@/types';
import { formatCurrency, formatPercentage, getColorBasedOnChange, getIconBasedOnChange } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StorePerformanceProps {
  data?: MetricData;
}

const StorePerformance: React.FC<StorePerformanceProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const revenueChange = ((data.revenue - data.previousRevenue) / data.previousRevenue) * 100;
  const ordersChange = ((data.orders - data.previousOrders) / data.previousOrders) * 100;
  const purchaseChange = ((data.totalPurchase - data.previousTotalPurchase) / data.previousTotalPurchase) * 100;
  const profitChange = ((data.profit - data.previousProfit) / data.previousProfit) * 100;
  const roiChange = ((data.roi - data.previousRoi) / data.previousRoi) * 100;

  return (
    <Card className="bg-primary-dark rounded-lg p-6 mb-6">
      <CardContent className="p-0">
        <div className="mb-4">
          <h3 className="text-white text-lg font-semibold">All Store Performance</h3>
          <p className="text-blue-200 text-sm">Monthly Comparison</p>
          <p className="text-blue-200 text-xs mt-1">Comparing to last month</p>
        </div>
        
        {/* Monthly KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-1">
          {/* Revenue Card */}
          <div className="bg-green-600 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-center bg-green-600 bg-opacity-10 w-8 h-8 rounded-md">
              <i className="fas fa-dollar-sign text-green-400"></i>
            </div>
            <h4 className="text-white text-sm mt-2">Revenue</h4>
            <p className="text-white text-xl font-bold mt-1">{formatCurrency(data.revenue)}</p>
            <div className="flex items-center mt-2 text-xs">
              <span className={cn("mr-2", getColorBasedOnChange(revenueChange))}>
                <i className={cn("fas", getIconBasedOnChange(revenueChange))}></i>
                {` ${Math.abs(revenueChange).toFixed(1)}%`}
              </span>
              <span className="text-blue-200">vs last month</span>
            </div>
          </div>
          
          {/* Orders Card */}
          <div className="bg-blue-500 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-center bg-blue-500 bg-opacity-10 w-8 h-8 rounded-md">
              <i className="fas fa-box text-blue-400"></i>
            </div>
            <h4 className="text-white text-sm mt-2">Orders</h4>
            <p className="text-white text-xl font-bold mt-1">{data.orders}</p>
            <div className="flex items-center mt-2 text-xs">
              <span className={cn("mr-2", getColorBasedOnChange(ordersChange))}>
                <i className={cn("fas", getIconBasedOnChange(ordersChange))}></i>
                {` ${Math.abs(ordersChange).toFixed(1)}%`}
              </span>
              <span className="text-blue-200">vs last month</span>
            </div>
          </div>
          
          {/* Total Purchase Card */}
          <div className="bg-purple-500 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-center bg-purple-500 bg-opacity-10 w-8 h-8 rounded-md">
              <i className="fas fa-shopping-cart text-purple-400"></i>
            </div>
            <h4 className="text-white text-sm mt-2">Total Purchase</h4>
            <p className="text-white text-xl font-bold mt-1">{formatCurrency(data.totalPurchase)}</p>
            <div className="flex items-center mt-2 text-xs">
              <span className={cn("mr-2", getColorBasedOnChange(purchaseChange))}>
                <i className={cn("fas", getIconBasedOnChange(purchaseChange))}></i>
                {` ${Math.abs(purchaseChange).toFixed(1)}%`}
              </span>
              <span className="text-blue-200">vs last month</span>
            </div>
          </div>
          
          {/* Profit Card */}
          <div className="bg-red-500 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-center bg-red-500 bg-opacity-10 w-8 h-8 rounded-md">
              <i className="fas fa-chart-line text-red-400"></i>
            </div>
            <h4 className="text-white text-sm mt-2">Profit</h4>
            <p className="text-white text-xl font-bold mt-1">{formatCurrency(data.profit)}</p>
            <div className="flex items-center mt-2 text-xs">
              <span className={cn("mr-2", getColorBasedOnChange(profitChange))}>
                <i className={cn("fas", getIconBasedOnChange(profitChange))}></i>
                {` ${Math.abs(profitChange).toFixed(1)}%`}
              </span>
              <span className="text-blue-200">vs last month</span>
            </div>
          </div>
          
          {/* ROI Card */}
          <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-center bg-yellow-500 bg-opacity-10 w-8 h-8 rounded-md">
              <i className="fas fa-percentage text-yellow-400"></i>
            </div>
            <h4 className="text-white text-sm mt-2">ROI</h4>
            <p className="text-white text-xl font-bold mt-1">{formatPercentage(data.roi)}</p>
            <div className="flex items-center mt-2 text-xs">
              <span className={cn("mr-2", getColorBasedOnChange(roiChange))}>
                <i className={cn("fas", getIconBasedOnChange(roiChange))}></i>
                {` ${Math.abs(roiChange).toFixed(1)}%`}
              </span>
              <span className="text-blue-200">vs last month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorePerformance;
