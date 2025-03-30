import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchShops, fetchShopPerformance } from '@/lib/googleSheetsApi';
import { TimeFilter, DateRange, ShopInfo } from '@/types';
import ShopDetails from './shops/ShopDetails';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const ShopsManagement: React.FC = () => {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [viewType, setViewType] = useState<'individual' | 'combined'>('individual');
  const [showNames, setShowNames] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('detailed');

  const { data: shops, isLoading: isLoadingShops } = useQuery({
    queryKey: ['/api/shops'],
    queryFn: fetchShops,
  });

  const { data: shopPerformance, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['/api/shops', selectedShopId, timeFilter, dateRange],
    queryFn: () => {
      if (selectedShopId) {
        return fetchShopPerformance(selectedShopId, timeFilter, dateRange);
      }
      return Promise.resolve(undefined);
    },
    enabled: !!selectedShopId,
  });

  const handleShopSelect = (shopId: number) => {
    setSelectedShopId(shopId);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setTimeFilter('custom');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Shops Management</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowNames(!showNames)} 
            className="flex items-center text-primary text-sm"
          >
            <i className={`far ${showNames ? 'fa-eye' : 'fa-eye-slash'} mr-1`}></i>
            <span>{showNames ? 'Hide Names' : 'Show Names'}</span>
          </Button>
          <Button variant="ghost" className="flex items-center text-gray-600 text-sm" onClick={() => window.location.href = '/'}>
            <span>Back to Overview</span>
          </Button>
          <Button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm flex items-center">
            <i className="fas fa-plus mr-1"></i>
            <span>Add Shop</span>
          </Button>
        </div>
      </div>

      {/* Shop Tabs */}
      <div className="flex mb-4 overflow-x-auto scrollbar-hidden">
        {isLoadingShops ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 mr-2 rounded-lg" />
          ))
        ) : (
          shops?.map((shop: ShopInfo) => (
            <Button
              key={shop.id}
              className={cn(
                "px-6 py-2 rounded-lg mr-2",
                selectedShopId === shop.id 
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => handleShopSelect(shop.id)}
            >
              {shop.name}
            </Button>
          ))
        )}
      </div>

      {/* Filter Options */}
      <div className="flex justify-end mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-blue-100 text-primary px-3 py-1 rounded-lg mr-2 text-sm flex items-center">
              <i className="far fa-calendar-alt mr-1"></i>
              <span>Date Range</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          className={cn(
            "px-3 py-1 rounded-lg mr-2 text-sm flex items-center",
            viewType === 'individual' 
              ? "bg-blue-100 text-primary" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onClick={() => setViewType('individual')}
        >
          <i className="fas fa-user mr-1"></i>
          <span>Individual</span>
        </Button>
        <Button
          variant="outline"
          className={cn(
            "px-3 py-1 rounded-lg text-sm flex items-center",
            viewType === 'combined'
              ? "bg-blue-100 text-primary"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onClick={() => setViewType('combined')}
        >
          <i className="fas fa-layer-group mr-1"></i>
          <span>Combined</span>
        </Button>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'overview' | 'detailed')} className="w-full mb-6">
        <TabsList className="border-b border-gray-200 w-full justify-start bg-transparent mb-6">
          <TabsTrigger 
            value="overview" 
            className={cn(
              "pb-2 mr-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent rounded-none",
            )}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="detailed" 
            className={cn(
              "pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent rounded-none",
            )}
          >
            Detailed Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-white rounded-lg p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Shops Overview</h3>
              {isLoadingShops ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shops?.map((shop: ShopInfo) => (
                    <Card key={shop.id} className="bg-gray-50 p-4">
                      <CardContent className="p-0">
                        <h4 className="font-medium text-gray-800">{shop.name}</h4>
                        <p className="text-gray-500 text-sm">{shop.platform} • {shop.region}</p>
                        <p className="text-gray-500 text-sm mt-2">Profit Share: {shop.profitSharePercentage}%</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          {selectedShopId && shopPerformance ? (
            <ShopDetails shop={shopPerformance} />
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-600">Select a shop to view detailed analytics</h3>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopsManagement;
