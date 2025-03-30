import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShopPerformance } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import DailyPerformance from './DailyPerformance';

interface ShopDetailsProps {
  shop: ShopPerformance;
}

const ShopDetails: React.FC<ShopDetailsProps> = ({ shop }) => {
  return (
    <Card className="bg-primary rounded-lg p-6 mb-6">
      <CardContent className="p-0">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">{shop.name}</h3>
            <p className="text-blue-200 text-sm">{shop.platform} • {shop.region}</p>
          </div>
          <div className="flex space-x-2">
            <button className="text-white p-1 rounded hover:bg-primary-light">
              <i className="fas fa-external-link-alt"></i>
            </button>
            <button className="text-white p-1 rounded hover:bg-primary-light">
              <i className="fas fa-pen"></i>
            </button>
          </div>
        </div>

        {/* Time Period Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Today */}
          <div className="bg-primary-dark bg-opacity-30 rounded-lg p-4">
            <h4 className="text-white mb-3">Today</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-dollar-sign text-xs mr-1"></i> Revenue
                </p>
                <p className="text-white text-xl font-bold">{formatCurrency(shop.today.revenue)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-box text-xs mr-1"></i> Orders
                </p>
                <p className="text-white text-xl font-bold">{shop.today.orders}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-chart-line text-xs mr-1"></i> Profit
                </p>
                <p className="text-white text-xl font-bold">{formatCurrency(shop.today.profit)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-percentage text-xs mr-1"></i> ROI
                </p>
                <p className="text-white text-xl font-bold">{formatPercentage(shop.today.roi)}</p>
              </div>
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="bg-primary-dark bg-opacity-30 rounded-lg p-4">
            <h4 className="text-white mb-3">Last 7 Days</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-dollar-sign text-xs mr-1"></i> Revenue
                </p>
                <p className="text-white text-xl font-bold">{formatCurrency(shop.lastSevenDays.revenue)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-box text-xs mr-1"></i> Orders
                </p>
                <p className="text-white text-xl font-bold">{shop.lastSevenDays.orders}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-chart-line text-xs mr-1"></i> Profit
                </p>
                <p className="text-white text-xl font-bold">{formatCurrency(shop.lastSevenDays.profit)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-percentage text-xs mr-1"></i> ROI
                </p>
                <p className="text-white text-xl font-bold">{formatPercentage(shop.lastSevenDays.roi)}</p>
              </div>
            </div>
          </div>

          {/* Last 30 Days */}
          <div className="bg-primary-dark bg-opacity-30 rounded-lg p-4">
            <h4 className="text-white mb-3">Last 30 Days</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-dollar-sign text-xs mr-1"></i> Revenue
                </p>
                <p className="text-white text-xl font-bold">{formatCurrency(shop.lastThirtyDays.revenue)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-box text-xs mr-1"></i> Orders
                </p>
                <p className="text-white text-xl font-bold">{shop.lastThirtyDays.orders}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-chart-line text-xs mr-1"></i> Profit
                </p>
                <p className="text-white text-xl font-bold">{formatCurrency(shop.lastThirtyDays.profit)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-1">
                  <i className="fas fa-percentage text-xs mr-1"></i> ROI
                </p>
                <p className="text-white text-xl font-bold">{formatPercentage(shop.lastThirtyDays.roi)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Performance Table */}
        <DailyPerformance dailyData={shop.dailyPerformance} />
      </CardContent>
    </Card>
  );
};

export default ShopDetails;
