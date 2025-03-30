export interface ShopInfo {
  id: number;
  name: string;
  platform: string;
  region: string;
  profitSharePercentage: number;
  sheetId?: string;
  sheetName?: string;
  revenue?: number;
  orders?: number;
  profit?: number;
  roi?: number;
}

export interface MetricData {
  revenue: number;
  orders: number;
  totalPurchase: number;
  profit: number;
  roi: number;
  previousRevenue: number;
  previousOrders: number;
  previousTotalPurchase: number;
  previousProfit: number;
  previousRoi: number;
}

export interface DailyMetric {
  date: string;
  revenue: number;
  orders: number;
  cost: number;
  profit: number;
  roi: number;
}

export interface ShopPerformance {
  id: number;
  name: string;
  platform: string;
  region: string;
  today: {
    revenue: number;
    orders: number;
    profit: number;
    roi: number;
  };
  lastSevenDays: {
    revenue: number;
    orders: number;
    profit: number;
    roi: number;
  };
  lastThirtyDays: {
    revenue: number;
    orders: number;
    profit: number;
    roi: number;
  };
  dailyPerformance: DailyMetric[];
}

export interface AgencyProfitData {
  total: number;
  totalStores: number;
  totalRevenue: number;
  avgProfitShare: number;
  storeProfitBreakdown: StoreProfitBreakdown[];
}

export interface StoreProfitBreakdown {
  id: number;
  name: string;
  revenue: number;
  costs: number;
  netProfit: number;
  profitSharePercentage: number;
  agencyProfit: number;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
}

export type TimeFilter = "today" | "yesterday" | "7d" | "30d" | "mtd" | "ytd" | "custom";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  sheetName: string;
}
