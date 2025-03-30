import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ShopInfo, DateRange } from '@/types';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';
import { format } from 'date-fns';
import { DollarSign, ShoppingBag, Percent, TrendingUp, Store } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchShopPerformance } from '@/lib/googleSheetsApi';

interface CombinedStoreAnalyticsProps {
  shops?: ShopInfo[];
  dateRange: DateRange;
  showNames: boolean;
}

const CombinedStoreAnalytics: React.FC<CombinedStoreAnalyticsProps> = ({ shops, dateRange, showNames }) => {
  // Fetch performance data for all shops
  const shopsData = shops?.map(shop => {
    const { data, isLoading } = useQuery({
      queryKey: ['/api/shops', shop.id, 'performance', dateRange],
      queryFn: () => fetchShopPerformance(shop.id, 'custom', dateRange),
    });
    
    return {
      shop,
      performance: data,
      isLoading
    };
  });

  const isLoading = shopsData?.some(shop => shop.isLoading) || !shopsData?.length;

  // Calculate combined metrics
  const combinedMetrics = React.useMemo(() => {
    if (isLoading || !shopsData?.length) return null;
    
    return shopsData.reduce((acc, { performance }) => {
      if (!performance) return acc;
      
      return {
        revenue: acc.revenue + performance.lastThirtyDays.revenue,
        orders: acc.orders + performance.lastThirtyDays.orders,
        profit: acc.profit + performance.lastThirtyDays.profit,
        avgRoi: (acc.avgRoi * acc.count + performance.lastThirtyDays.roi) / (acc.count + 1),
        count: acc.count + 1
      };
    }, { revenue: 0, orders: 0, profit: 0, avgRoi: 0, count: 0 });
  }, [shopsData, isLoading]);

  // Format date range for display
  const dateRangeStr = dateRange.from && dateRange.to 
    ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    : 'All time';

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Combined Store Analytics</h2>
          <p className="text-gray-600">All stores • {dateRangeStr}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array(4).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Revenue */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1 opacity-80">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Total Revenue</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {combinedMetrics ? formatCurrency(combinedMetrics.revenue) : '$0.00'}
                    </div>
                    <div className="flex items-center text-xs">
                      <span>Across {combinedMetrics?.count || 0} stores</span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1 opacity-80">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {combinedMetrics ? formatNumber(combinedMetrics.orders) : '0'}
                    </div>
                    <div className="flex items-center text-xs">
                      <span>Across {combinedMetrics?.count || 0} stores</span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1 opacity-80">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Total Profit</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {combinedMetrics ? formatCurrency(combinedMetrics.profit) : '$0.00'}
                    </div>
                    <div className="flex items-center text-xs">
                      <span>Across {combinedMetrics?.count || 0} stores</span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avg ROI */}
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1 opacity-80">
                      <Percent className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Average ROI</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {combinedMetrics ? formatPercentage(combinedMetrics.avgRoi) : '0%'}
                    </div>
                    <div className="flex items-center text-xs">
                      <span>Across {combinedMetrics?.count || 0} stores</span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Percent className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Store Comparison Table */}
          <Card className="bg-white rounded-lg shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Comparison</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase">
                      <th scope="col" className="px-4 py-3 text-left">Store</th>
                      <th scope="col" className="px-4 py-3 text-right">Revenue</th>
                      <th scope="col" className="px-4 py-3 text-right">Orders</th>
                      <th scope="col" className="px-4 py-3 text-right">Profit</th>
                      <th scope="col" className="px-4 py-3 text-right">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shopsData?.map(({ shop, performance }) => (
                      <tr key={shop.id} className="text-gray-800">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Store className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium">
                              {showNames ? shop.name : `Shop ${shop.id}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          {performance ? formatCurrency(performance.lastThirtyDays.revenue) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          {performance ? performance.lastThirtyDays.orders : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          {performance ? formatCurrency(performance.lastThirtyDays.profit) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          {performance ? formatPercentage(performance.lastThirtyDays.roi) : '-'}
                        </td>
                      </tr>
                    ))}
                    {combinedMetrics && (
                      <tr className="text-gray-800 bg-gray-50 font-medium">
                        <td className="px-4 py-4 whitespace-nowrap">Combined Total</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(combinedMetrics.revenue)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">{combinedMetrics.orders}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(combinedMetrics.profit)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">{formatPercentage(combinedMetrics.avgRoi)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CombinedStoreAnalytics;