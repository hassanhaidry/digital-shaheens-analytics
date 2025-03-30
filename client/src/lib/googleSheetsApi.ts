import { apiRequest } from './queryClient';
import type { 
  MetricData, 
  ShopPerformance, 
  AgencyProfitData, 
  TimeFilter, 
  DateRange,
  ShopInfo
} from '@/types';

// Function to fetch performance metrics based on time filter
export async function fetchPerformanceMetrics(
  timeFilter: TimeFilter = 'today',
  dateRange?: DateRange
): Promise<MetricData> {
  const params = new URLSearchParams();
  
  params.append('timeFilter', timeFilter);
  
  if (dateRange) {
    params.append('from', dateRange.from.toISOString());
    params.append('to', dateRange.to.toISOString());
  }
  
  const response = await apiRequest('GET', `/api/metrics?${params.toString()}`);
  return response.json();
}

// Function to fetch all shops
export async function fetchShops(): Promise<ShopInfo[]> {
  const response = await apiRequest('GET', '/api/shops');
  return response.json();
}

// Function to fetch shop performance data
export async function fetchShopPerformance(
  shopId: number,
  timeFilter: TimeFilter = 'today',
  dateRange?: DateRange
): Promise<ShopPerformance> {
  const params = new URLSearchParams();
  
  params.append('timeFilter', timeFilter);
  
  if (dateRange) {
    params.append('from', dateRange.from.toISOString());
    params.append('to', dateRange.to.toISOString());
  }
  
  const response = await apiRequest('GET', `/api/shops/${shopId}/performance?${params.toString()}`);
  return response.json();
}

// Function to fetch agency profit data
export async function fetchAgencyProfit(
  dateRange?: DateRange
): Promise<AgencyProfitData> {
  const params = new URLSearchParams();
  
  if (dateRange) {
    params.append('from', dateRange.from.toISOString());
    params.append('to', dateRange.to.toISOString());
  }
  
  const response = await apiRequest('GET', `/api/agency-profit?${params.toString()}`);
  return response.json();
}

// Function to update shop profit share settings
export async function updateShopProfitShare(
  shopId: number,
  profitSharePercentage: number
): Promise<ShopInfo> {
  const response = await apiRequest('PATCH', `/api/shops/${shopId}/profit-share`, {
    profitSharePercentage
  });
  return response.json();
}

// Function to add a new shop
export async function addShop(
  shop: Omit<ShopInfo, 'id'>
): Promise<ShopInfo> {
  const response = await apiRequest('POST', '/api/shops', shop);
  return response.json();
}

// Function to fetch chart data
export async function fetchChartData(
  timeFilter: TimeFilter = '30d',
  dateRange?: DateRange
): Promise<any> {
  const params = new URLSearchParams();
  
  params.append('timeFilter', timeFilter);
  
  if (dateRange) {
    params.append('from', dateRange.from.toISOString());
    params.append('to', dateRange.to.toISOString());
  }
  
  const response = await apiRequest('GET', `/api/chart-data?${params.toString()}`);
  return response.json();
}
