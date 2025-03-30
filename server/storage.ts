import { 
  User, 
  InsertUser, 
  Shop, 
  InsertShop, 
  PerformanceMetric, 
  InsertPerformanceMetric 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shop operations
  getShops(): Promise<Shop[]>;
  getShopById(id: number): Promise<Shop | undefined>;
  createShop(shop: InsertShop): Promise<Shop>;
  updateShop(id: number, shop: Partial<Shop>): Promise<Shop | undefined>;
  
  // Performance metrics operations
  getPerformanceMetrics(
    shopId?: number, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<PerformanceMetric[]>;
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private shops: Map<number, Shop>;
  private performanceMetrics: Map<number, PerformanceMetric>;
  private userIdCounter: number;
  private shopIdCounter: number;
  private metricIdCounter: number;

  constructor() {
    this.users = new Map();
    this.shops = new Map();
    this.performanceMetrics = new Map();
    this.userIdCounter = 1;
    this.shopIdCounter = 1;
    this.metricIdCounter = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "password",
      email: "admin@example.com",
      role: "admin"
    });
    
    // Initialize with sample shops
    this.createSampleShops();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Shop operations
  async getShops(): Promise<Shop[]> {
    return Array.from(this.shops.values());
  }
  
  async getShopById(id: number): Promise<Shop | undefined> {
    return this.shops.get(id);
  }
  
  async createShop(insertShop: InsertShop): Promise<Shop> {
    const id = this.shopIdCounter++;
    const shop: Shop = { 
      ...insertShop, 
      id, 
      createdAt: new Date(),
      profitSharePercentage: Number(insertShop.profitSharePercentage)
    };
    this.shops.set(id, shop);
    return shop;
  }
  
  async updateShop(id: number, shopUpdate: Partial<Shop>): Promise<Shop | undefined> {
    const shop = this.shops.get(id);
    if (!shop) return undefined;
    
    const updatedShop = { ...shop, ...shopUpdate };
    this.shops.set(id, updatedShop);
    return updatedShop;
  }
  
  // Performance metrics operations
  async getPerformanceMetrics(
    shopId?: number, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<PerformanceMetric[]> {
    let metrics = Array.from(this.performanceMetrics.values());
    
    if (shopId) {
      metrics = metrics.filter(metric => metric.shopId === shopId);
    }
    
    if (startDate) {
      metrics = metrics.filter(metric => new Date(metric.date) >= startDate);
    }
    
    if (endDate) {
      metrics = metrics.filter(metric => new Date(metric.date) <= endDate);
    }
    
    return metrics;
  }
  
  async createPerformanceMetric(insertMetric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const id = this.metricIdCounter++;
    const metric: PerformanceMetric = { 
      ...insertMetric, 
      id,
      revenue: Number(insertMetric.revenue),
      totalPurchase: Number(insertMetric.totalPurchase),
      profit: Number(insertMetric.profit),
      roi: Number(insertMetric.roi)
    };
    this.performanceMetrics.set(id, metric);
    return metric;
  }
  
  // Helper to create sample shops for demo
  private async createSampleShops() {
    const shops = [
      { name: "Home Expo", platform: "TikTok", region: "USA", profitSharePercentage: 40 },
      { name: "Deal Hoper", platform: "Instagram", region: "Canada", profitSharePercentage: 50 },
      { name: "Randawoo TTS", platform: "Facebook", region: "UK", profitSharePercentage: 50 },
      { name: "Marvikarts - TTS", platform: "TikTok", region: "Australia", profitSharePercentage: 50 }
    ];
    
    for (const shop of shops) {
      await this.createShop({
        name: shop.name,
        platform: shop.platform,
        region: shop.region,
        profitSharePercentage: shop.profitSharePercentage
      });
    }
    
    // Create sample performance metrics
    await this.createSamplePerformanceMetrics();
  }
  
  private async createSamplePerformanceMetrics() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Sample metrics for Shop 1 (Home Expo)
    await this.createPerformanceMetric({
      shopId: 1,
      date: today,
      revenue: 344.13,
      orders: 16,
      totalPurchase: 206.48,
      profit: 137.65,
      roi: 66.67
    });
    
    await this.createPerformanceMetric({
      shopId: 1,
      date: yesterday,
      revenue: 385.02,
      orders: 16,
      totalPurchase: 231.01,
      profit: 154.01,
      roi: 66.67
    });
    
    // Sample metrics for Shop 2 (Deal Hoper)
    await this.createPerformanceMetric({
      shopId: 2,
      date: today,
      revenue: 289.45,
      orders: 12,
      totalPurchase: 173.67,
      profit: 115.78,
      roi: 66.67
    });
    
    // Sample metrics for Shop 3 (Randawoo TTS)
    await this.createPerformanceMetric({
      shopId: 3,
      date: today,
      revenue: 425.65,
      orders: 18,
      totalPurchase: 255.39,
      profit: 170.26,
      roi: 66.67
    });
    
    // Sample metrics for Shop 4 (Marvikarts - TTS)
    await this.createPerformanceMetric({
      shopId: 4,
      date: today,
      revenue: 265.22,
      orders: 10,
      totalPurchase: 159.13,
      profit: 106.09,
      roi: 66.67
    });
  }
}

export const storage = new MemStorage();
