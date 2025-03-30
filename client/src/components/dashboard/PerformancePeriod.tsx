import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeFilter, DateRange } from '@/types';

interface PerformancePeriodProps {
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  onDateRangeChange: (range: DateRange) => void;
}

const PerformancePeriod: React.FC<PerformancePeriodProps> = ({ 
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

  const handleTimeFilterChange = (value: string) => {
    onTimeFilterChange(value as TimeFilter);
  };

  return (
    <Card className="bg-primary-dark rounded-lg p-6 mb-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold">Performance Period</h3>
            <p className="text-blue-200 text-sm">Select a time period to view performance data</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-1 flex items-center">
              <Select onValueChange={handleTimeFilterChange} defaultValue={timeFilter}>
                <SelectTrigger className="border-none bg-transparent text-blue-200 focus:ring-0">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="mtd">Month to Date</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default" className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center">
                  <i className="fas fa-calendar-alt mr-1"></i>
                  <span>Custom</span>
                </Button>
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
      </CardContent>
    </Card>
  );
};

export default PerformancePeriod;
