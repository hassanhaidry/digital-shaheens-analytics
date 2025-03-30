import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPerformanceMetrics, fetchChartData } from '@/lib/googleSheetsApi';
import { TimeFilter, DateRange } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Box, ShoppingCart, TrendingUp, PercentCircle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import PerformanceChart from './dashboard/PerformanceChart';

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['/api/metrics', timeFilter, dateRange],
    queryFn: () => fetchPerformanceMetrics(timeFilter, dateRange),
  });

  const { data: chartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['/api/chart-data', timeFilter, dateRange],
    queryFn: () => fetchChartData(timeFilter, dateRange),
  });

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
    if (filter !== 'custom') {
      setDateRange(undefined);
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setTimeFilter('custom');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Digital Shaheens Dashboard</h2>
        <p className="text-gray-600">Combined Performance Overview</p>
      </div>

      {/* Performance Analytics Card */}
      <Card className="bg-primary rounded-lg overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white text-lg font-semibold">Performance Analytics</h3>
              <p className="text-blue-200 text-sm">Store - {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}</p>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant={timeFilter === 'today' ? 'secondary' : 'ghost'} 
                onClick={() => handleTimeFilterChange('today')}
                className={`rounded-full py-1 px-3 text-xs ${timeFilter === 'today' ? 'bg-white text-primary' : 'text-blue-200 hover:text-white'}`}
              >
                Today
              </Button>
              <Button 
                variant={timeFilter === 'yesterday' ? 'secondary' : 'ghost'} 
                onClick={() => handleTimeFilterChange('yesterday')}
                className={`rounded-full py-1 px-3 text-xs ${timeFilter === 'yesterday' ? 'bg-white text-primary' : 'text-blue-200 hover:text-white'}`}
              >
                Yesterday
              </Button>
              <Button 
                variant={timeFilter === '7d' ? 'secondary' : 'ghost'} 
                onClick={() => handleTimeFilterChange('7d')}
                className={`rounded-full py-1 px-3 text-xs ${timeFilter === '7d' ? 'bg-white text-primary' : 'text-blue-200 hover:text-white'}`}
              >
                7D
              </Button>
              <Button 
                variant={timeFilter === '30d' ? 'secondary' : 'ghost'} 
                onClick={() => handleTimeFilterChange('30d')}
                className={`rounded-full py-1 px-3 text-xs ${timeFilter === '30d' ? 'bg-white text-primary' : 'text-blue-200 hover:text-white'}`}
              >
                30D
              </Button>
              <Button 
                variant={timeFilter === 'mtd' ? 'secondary' : 'ghost'} 
                onClick={() => handleTimeFilterChange('mtd')}
                className={`rounded-full py-1 px-3 text-xs ${timeFilter === 'mtd' ? 'bg-white text-primary' : 'text-blue-200 hover:text-white'}`}
              >
                MTD
              </Button>
              <Button 
                variant={timeFilter === 'ytd' ? 'secondary' : 'ghost'} 
                onClick={() => handleTimeFilterChange('ytd')}
                className={`rounded-full py-1 px-3 text-xs ${timeFilter === 'ytd' ? 'bg-white text-primary' : 'text-blue-200 hover:text-white'}`}
              >
                YTD
              </Button>
              <Button 
                variant={timeFilter === 'custom' ? 'secondary' : 'ghost'} 
                onClick={() => {/* Open date picker */}}
                className={`rounded-full py-1 px-3 text-xs ${timeFilter === 'custom' ? 'bg-white text-primary' : 'text-blue-200 hover:text-white flex items-center'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Custom
              </Button>
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Revenue Card */}
            <div className="bg-green-600 rounded-lg p-4 relative overflow-hidden">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white bg-opacity-20">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                
                <div className="absolute right-2 top-2 text-xs">
                  <span className="text-red-300">
                    ↓ 100.0%
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-white text-sm mb-1">Revenue</p>
                <p className="text-white text-2xl font-bold">
                  {isLoadingMetrics ? '$0.00' : formatCurrency(metricsData?.revenue || 0)}
                </p>
              </div>
            </div>
            
            {/* Orders Card */}
            <div className="bg-blue-500 rounded-lg p-4 relative overflow-hidden">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white bg-opacity-20">
                  <Box className="h-5 w-5 text-white" />
                </div>
                
                <div className="absolute right-2 top-2 text-xs">
                  <span className="text-red-300">
                    ↓ 100.0%
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-white text-sm mb-1">Orders</p>
                <p className="text-white text-2xl font-bold">
                  {isLoadingMetrics ? '0' : metricsData?.orders || 0}
                </p>
              </div>
            </div>
            
            {/* Total Purchase Card */}
            <div className="bg-purple-600 rounded-lg p-4 relative overflow-hidden">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white bg-opacity-20">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                
                <div className="absolute right-2 top-2 text-xs">
                  <span className="text-red-300">
                    ↓ 100.0%
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-white text-sm mb-1">Total Purchase</p>
                <p className="text-white text-2xl font-bold">
                  {isLoadingMetrics ? '$0.00' : formatCurrency(metricsData?.totalPurchase || 0)}
                </p>
              </div>
            </div>
            
            {/* Profit Card */}
            <div className="bg-pink-600 rounded-lg p-4 relative overflow-hidden">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white bg-opacity-20">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                
                <div className="absolute right-2 top-2 text-xs">
                  <span className="text-red-300">
                    ↓ 100.0%
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-white text-sm mb-1">Profit</p>
                <p className="text-white text-2xl font-bold">
                  {isLoadingMetrics ? '$0.00' : formatCurrency(metricsData?.profit || 0)}
                </p>
              </div>
            </div>
            
            {/* ROI Card */}
            <div className="bg-yellow-500 rounded-lg p-4 relative overflow-hidden">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white bg-opacity-20">
                  <PercentCircle className="h-5 w-5 text-white" />
                </div>
                
                <div className="absolute right-2 top-2 text-xs">
                  <span className="text-red-300">
                    ↓ 100.0%
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-white text-sm mb-1">ROI</p>
                <p className="text-white text-2xl font-bold">
                  {isLoadingMetrics ? '0.0%' : formatPercentage(metricsData?.roi || 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Performance Overview</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-primary border-gray-200 bg-gray-50">
                Revenue
              </Button>
              <Button variant="outline" size="sm" className="text-primary border-gray-200 bg-gray-50">
                Orders
              </Button>
              <Button variant="outline" size="sm" className="text-primary border-gray-200 bg-gray-50">
                Profit
              </Button>
              <Button variant="default" size="sm" className="bg-primary text-white">
                All Metrics
              </Button>
            </div>
          </div>
          
          {isLoadingChart ? (
            <Skeleton className="h-64 w-full bg-gray-100" />
          ) : (
            <PerformanceChart data={chartData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
