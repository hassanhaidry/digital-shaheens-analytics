import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPerformanceMetrics, fetchChartData } from '@/lib/googleSheetsApi';
import { TimeFilter, DateRange } from '@/types';
import PerformanceMetrics from './dashboard/PerformanceMetrics';
import PerformancePeriod from './dashboard/PerformancePeriod';
import StorePerformance from './dashboard/StorePerformance';
import PerformanceChart from './dashboard/PerformanceChart';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

      {isLoadingMetrics ? (
        <Card className="bg-primary-dark rounded-lg p-6 mb-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white text-lg font-semibold">Performance Analytics</h3>
                <p className="text-blue-200 text-sm">Store - Loading...</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 bg-gray-700 opacity-30" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <PerformanceMetrics 
          data={metricsData} 
          timeFilter={timeFilter}
          onTimeFilterChange={handleTimeFilterChange}
          onDateRangeChange={handleDateRangeChange}
        />
      )}

      <PerformancePeriod 
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
        onDateRangeChange={handleDateRangeChange}
      />

      {isLoadingMetrics ? (
        <Card className="bg-primary-dark rounded-lg p-6 mb-6">
          <CardContent className="p-0">
            <div className="mb-4">
              <Skeleton className="h-6 w-40 bg-gray-700 opacity-30" />
              <Skeleton className="h-4 w-20 mt-2 bg-gray-700 opacity-30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 bg-gray-700 opacity-30" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <StorePerformance data={metricsData} />
      )}

      <Card className="bg-white rounded-lg shadow-sm p-6">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Performance Overview</h3>
            <div className="flex space-x-2">
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">Revenue</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">Orders</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">Profit</button>
              <button className="bg-primary text-white px-3 py-1 rounded-lg text-sm">All Metrics</button>
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
