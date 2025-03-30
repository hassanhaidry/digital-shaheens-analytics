import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShopPerformance, DateRange } from '@/types';
import { formatCurrency, formatPercentage, formatNumber, getColorBasedOnChange, calculatePercentageChange } from '@/lib/utils';
import { format } from 'date-fns';
import { DollarSign, ShoppingBag, Percent, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DailyPerformance from './DailyPerformance';

interface DetailedAnalyticsProps {
  shop: ShopPerformance;
  dateRange: DateRange;
  showNames: boolean;
}

const DetailedAnalytics: React.FC<DetailedAnalyticsProps> = ({ shop, dateRange, showNames }) => {
  const displayName = showNames ? shop.name : `Shop ${shop.id}`;
  const dateRangeStr = dateRange.from && dateRange.to 
    ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    : 'All time';

  // Use 30-day data for comparison with today's data
  const revenueChange = calculatePercentageChange(shop.today.revenue, shop.lastThirtyDays.revenue / 30);
  const ordersChange = calculatePercentageChange(shop.today.orders, shop.lastThirtyDays.orders / 30);
  const profitChange = calculatePercentageChange(shop.today.profit, shop.lastThirtyDays.profit / 30);
  const roiChange = calculatePercentageChange(shop.today.roi, shop.lastThirtyDays.roi);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{displayName} Analytics</h2>
          <p className="text-gray-600">{shop.platform} • {shop.region} • {dateRangeStr}</p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Revenue */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1 opacity-80">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <div className="text-2xl font-bold mb-2">{formatCurrency(shop.lastThirtyDays.revenue)}</div>
                <div className={`flex items-center text-xs ${getColorBasedOnChange(revenueChange)}`}>
                  {revenueChange >= 0 ? 
                    <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  <span>{Math.abs(revenueChange).toFixed(1)}% from avg</span>
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
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <div className="text-2xl font-bold mb-2">{formatNumber(shop.lastThirtyDays.orders)}</div>
                <div className={`flex items-center text-xs ${getColorBasedOnChange(ordersChange)}`}>
                  {ordersChange >= 0 ? 
                    <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  <span>{Math.abs(ordersChange).toFixed(1)}% from avg</span>
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
                  <span className="text-sm font-medium">Profit</span>
                </div>
                <div className="text-2xl font-bold mb-2">{formatCurrency(shop.lastThirtyDays.profit)}</div>
                <div className={`flex items-center text-xs ${getColorBasedOnChange(profitChange)}`}>
                  {profitChange >= 0 ? 
                    <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  <span>{Math.abs(profitChange).toFixed(1)}% from avg</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI */}
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1 opacity-80">
                  <Percent className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">ROI</span>
                </div>
                <div className="text-2xl font-bold mb-2">{formatPercentage(shop.lastThirtyDays.roi)}</div>
                <div className={`flex items-center text-xs ${getColorBasedOnChange(roiChange)}`}>
                  {roiChange >= 0 ? 
                    <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  <span>{Math.abs(roiChange).toFixed(1)}% from avg</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <Percent className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Performance Chart */}
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Performance</h3>
          <DailyPerformance dailyData={shop.dailyPerformance} />
        </CardContent>
      </Card>

      {/* Performance Breakdown */}
      <Card className="bg-white rounded-lg shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Breakdown</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th scope="col" className="px-4 py-3 text-left">Time Period</th>
                  <th scope="col" className="px-4 py-3 text-right">Revenue</th>
                  <th scope="col" className="px-4 py-3 text-right">Orders</th>
                  <th scope="col" className="px-4 py-3 text-right">Profit</th>
                  <th scope="col" className="px-4 py-3 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="text-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap font-medium">Today</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.today.revenue)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{shop.today.orders}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.today.profit)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatPercentage(shop.today.roi)}</td>
                </tr>
                <tr className="text-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap font-medium">Last 7 Days</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.lastSevenDays.revenue)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{shop.lastSevenDays.orders}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.lastSevenDays.profit)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatPercentage(shop.lastSevenDays.roi)}</td>
                </tr>
                <tr className="text-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap font-medium">Last 30 Days</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.lastThirtyDays.revenue)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{shop.lastThirtyDays.orders}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.lastThirtyDays.profit)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatPercentage(shop.lastThirtyDays.roi)}</td>
                </tr>
                <tr className="text-gray-800 bg-gray-50 font-medium">
                  <td className="px-4 py-4 whitespace-nowrap">Daily Average (30d)</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.lastThirtyDays.revenue / 30)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{(shop.lastThirtyDays.orders / 30).toFixed(1)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatCurrency(shop.lastThirtyDays.profit / 30)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{formatPercentage(shop.lastThirtyDays.roi)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedAnalytics;