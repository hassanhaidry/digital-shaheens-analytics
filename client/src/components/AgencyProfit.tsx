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
import { CalendarIcon } from 'lucide-react';

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

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const formatDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`;
    }
    return 'Select date range';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agency Profit Dashboard</h2>
          <p className="text-gray-600">Manage profit share settings and view agency earnings</p>
        </div>
        
        {/* Date Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-blue-50 border border-blue-100 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{formatDateRange()}</span>
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

      {/* Tabs */}
      <div className="mt-5 mb-6 border-b border-gray-200">
        <div className="flex">
          <div 
            className={`pb-2 px-4 mr-4 cursor-pointer ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Profit Overview
          </div>
          <div 
            className={`pb-2 px-4 cursor-pointer ${activeTab === 'settings' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('settings')}
          >
            Profit Share Settings
          </div>
        </div>
      </div>

      {activeTab === 'overview' ? (
        isLoading ? (
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
        )
      ) : (
        isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ProfitShareSettings />
        )
      )}
    </div>
  );
};

export default AgencyProfit;
