import { PerformanceMetric, Shop } from '@shared/schema';

interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  sheetName: string;
}

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;
  
  constructor() {
    // Get configuration from environment variables
    this.config = {
      apiKey: process.env.GOOGLE_API_KEY || "",
      spreadsheetId: process.env.SPREADSHEET_ID || "",
      sheetName: process.env.SHEET_NAME || "Sales Data"
    };
  }
  
  // Method to fetch data from Google Sheets
  async fetchSheetData(): Promise<any[]> {
    if (!this.config.apiKey || !this.config.spreadsheetId) {
      throw new Error("Google Sheets API key or spreadsheet ID is missing");
    }
    
    try {
      // In a real implementation, we would use the Google Sheets API
      // For now, we'll return sample data
      return this.getSampleData();
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
      throw new Error("Failed to fetch data from Google Sheets");
    }
  }
  
  // Method to calculate metrics from raw data
  async calculateMetrics(shopId: number, startDate?: Date, endDate?: Date): Promise<PerformanceMetric[]> {
    try {
      const data = await this.fetchSheetData();
      // Filter data by shop ID
      const shopData = data.filter(row => row.shopId === shopId);
      
      // Filter by date range
      let filteredData = shopData;
      if (startDate) {
        filteredData = filteredData.filter(row => new Date(row.date) >= startDate);
      }
      if (endDate) {
        filteredData = filteredData.filter(row => new Date(row.date) <= endDate);
      }
      
      // Transform to performance metrics
      return filteredData.map(row => ({
        id: row.id,
        shopId: row.shopId,
        date: new Date(row.date),
        revenue: row.revenue,
        orders: row.orders,
        totalPurchase: row.totalPurchase,
        profit: row.profit,
        roi: row.roi
      }));
    } catch (error) {
      console.error("Error calculating metrics:", error);
      throw new Error("Failed to calculate metrics from sheet data");
    }
  }
  
  // Sample data for testing/demo purposes
  private getSampleData(): any[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: 1,
        shopId: 1,
        date: today.toISOString(),
        revenue: 344.13,
        orders: 16,
        totalPurchase: 206.48,
        profit: 137.65,
        roi: 66.67
      },
      {
        id: 2,
        shopId: 1,
        date: yesterday.toISOString(),
        revenue: 385.02,
        orders: 16,
        totalPurchase: 231.01,
        profit: 154.01,
        roi: 66.67
      }
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();
