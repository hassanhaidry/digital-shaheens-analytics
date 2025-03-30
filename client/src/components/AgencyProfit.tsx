import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAgencyProfit } from '@/lib/googleSheetsApi';
import { DateRange } from '@/types';
import ProfitOverview from './agency/ProfitOverview';
import ProfitShareSettings from './agency/ProfitShareSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const AgencyProfit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const { data: agencyProfitData, isLoading } = useQuery({
    queryKey: ['/api/agency-profit', dateRange],
    queryFn: () => fetchAgencyProfit(dateRange),
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
    }
  };

  const formatDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`;
    }
    return 'Select date range';
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Agency Profit Dashboard</h3>
        <p className="text-gray-500">Manage profit share settings and view agency earnings</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'overview' | 'settings')} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="border-b border-gray-200 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="pb-2 mr-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent rounded-none"
              >
                Profit Overview
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent rounded-none"
              >
                Profit Share Settings
              </TabsTrigger>
            </TabsList>

            {/* Date Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-blue-100 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center">
                  <span>{formatDateRange()}</span>
                  <i className="fas fa-chevron-down ml-1"></i>
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
          </div>

          <TabsContent value="overview">
            {isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
                <Skeleton className="h-80 w-full" />
              </div>
            ) : (
              <ProfitOverview data={agencyProfitData} dateRange={dateRange} />
            )}
          </TabsContent>

          <TabsContent value="settings">
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ProfitShareSettings />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyProfit;
