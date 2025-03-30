import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { formatCurrency, formatPercentage, getColorBasedOnChange, getIconBasedOnChange } from '@/lib/utils';
import { MetricData, TimeFilter, DateRange } from '@/types';
import { cn } from '@/lib/utils';

interface PerformanceMetricsProps {
  data?: MetricData;
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  onDateRangeChange: (range: DateRange) => void;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  data, 
  timeFilter, 
  onTimeFilterChange,
  onDateRangeChange
}) => {
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const handleSelectDate = (selectedDate: DateRange | undefined) => {
    if (selectedDate?.from && selectedDate?.to) {
      setDate(selectedDate);
      onDateRangeChange(selectedDate);
    }
  };

  if (!data) {
    return null;
  }

  const getPercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const revenueChange = getPercentageChange(data.revenue, data.previousRevenue);
  const ordersChange = getPercentageChange(data.orders, data.previousOrders);
  const purchaseChange = getPercentageChange(data.totalPurchase, data.previousTotalPurchase);
  const profitChange = getPercentageChange(data.profit, data.previousProfit);
  const roiChange = getPercentageChange(data.roi, data.previousRoi);

  return (
    <Card className="bg-primary-dark rounded-lg p-6 mb-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Performance Analytics</h3>
            <p className="text-blue-200 text-sm">Store - {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}</p>
          </div>
          
          {/* Time Period Filter */}
          <div className="flex bg-primary rounded-lg overflow-hidden">
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                timeFilter === 'today' ? "bg-white text-primary" : "text-blue-200 hover:bg-primary-light"
              )}
              onClick={() => onTimeFilterChange('today')}
            >
              Today
            </button>
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                timeFilter === 'yesterday' ? "bg-white text-primary" : "text-blue-200 hover:bg-primary-light"
              )}
              onClick={() => onTimeFilterChange('yesterday')}
            >
              Yesterday
            </button>
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                timeFilter === '7d' ? "bg-white text-primary" : "text-blue-200 hover:bg-primary-light"
              )}
              onClick={() => onTimeFilterChange('7d')}
            >
              7D
            </button>
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                timeFilter === '30d' ? "bg-white text-primary" : "text-blue-200 hover:bg-primary-light"
              )}
              onClick={() => onTimeFilterChange('30d')}
            >
              30D
            </button>
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                timeFilter === 'mtd' ? "bg-white text-primary" : "text-blue-200 hover:bg-primary-light"
              )}
              onClick={() => onTimeFilterChange('mtd')}
            >
              MTD
            </button>
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                timeFilter === 'ytd' ? "bg-white text-primary" : "text-blue-200 hover:bg-primary-light"
              )}
              onClick={() => onTimeFilterChange('ytd')}
            >
              YTD
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium flex items-center", 
                    timeFilter === 'custom' ? "bg-white text-primary" : "text-blue-200 hover:bg-primary-light"
                  )}
                >
                  <i className="fas fa-calendar-alt mr-1"></i> Custom
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={handleSelectDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Revenue Card */}
          <div className="bg-green-600 bg-opacity-90 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <i className="fas fa-dollar-sign text-xl"></i>
              </div>
              <div className="text-right">
                <span className={cn("text-sm", getColorBasedOnChange(revenueChange))}>
                  <i className={cn("fas", getIconBasedOnChange(revenueChange))}></i>
                  {` ${Math.abs(revenueChange).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <h4 className="text-white mt-2">Revenue</h4>
            <p className="text-white text-2xl font-bold mt-1">{formatCurrency(data.revenue)}</p>
          </div>
          
          {/* Orders Card */}
          <div className="bg-blue-500 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <i className="fas fa-box text-xl"></i>
              </div>
              <div className="text-right">
                <span className={cn("text-sm", getColorBasedOnChange(ordersChange))}>
                  <i className={cn("fas", getIconBasedOnChange(ordersChange))}></i>
                  {` ${Math.abs(ordersChange).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <h4 className="text-white mt-2">Orders</h4>
            <p className="text-white text-2xl font-bold mt-1">{data.orders}</p>
          </div>
          
          {/* Total Purchase Card */}
          <div className="bg-purple-500 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <i className="fas fa-shopping-cart text-xl"></i>
              </div>
              <div className="text-right">
                <span className={cn("text-sm", getColorBasedOnChange(purchaseChange))}>
                  <i className={cn("fas", getIconBasedOnChange(purchaseChange))}></i>
                  {` ${Math.abs(purchaseChange).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <h4 className="text-white mt-2">Total Purchase</h4>
            <p className="text-white text-2xl font-bold mt-1">{formatCurrency(data.totalPurchase)}</p>
          </div>
          
          {/* Profit Card */}
          <div className="bg-red-500 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <div className="text-right">
                <span className={cn("text-sm", getColorBasedOnChange(profitChange))}>
                  <i className={cn("fas", getIconBasedOnChange(profitChange))}></i>
                  {` ${Math.abs(profitChange).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <h4 className="text-white mt-2">Profit</h4>
            <p className="text-white text-2xl font-bold mt-1">{formatCurrency(data.profit)}</p>
          </div>
          
          {/* ROI Card */}
          <div className="bg-yellow-500 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <i className="fas fa-percentage text-xl"></i>
              </div>
              <div className="text-right">
                <span className={cn("text-sm", getColorBasedOnChange(roiChange))}>
                  <i className={cn("fas", getIconBasedOnChange(roiChange))}></i>
                  {` ${Math.abs(roiChange).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <h4 className="text-white mt-2">ROI</h4>
            <p className="text-white text-2xl font-bold mt-1">{formatPercentage(data.roi)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
