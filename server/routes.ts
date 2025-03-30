import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { googleSheetsService } from "./googleSheetsService";
import { z } from "zod";
import { insertShopSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = express.Router();

  // ===== METRICS ENDPOINTS =====
  apiRouter.get("/metrics", async (req, res) => {
    try {
      const timeFilter = req.query.timeFilter as string || 'today';
      let from, to;

      if (req.query.from && req.query.to) {
        from = new Date(req.query.from as string);
        to = new Date(req.query.to as string);
      } else {
        // Calculate date range based on time filter
        const today = new Date();
        from = new Date(today);
        to = new Date(today);

        switch (timeFilter) {
          case 'yesterday':
            from.setDate(from.getDate() - 1);
            to.setDate(to.getDate() - 1);
            break;
          case '7d':
            from.setDate(from.getDate() - 7);
            break;
          case '30d':
            from.setDate(from.getDate() - 30);
            break;
          case 'mtd':
            from.setDate(1); // First day of current month
            break;
          case 'ytd':
            from.setMonth(0, 1); // January 1st of current year
            break;
          case 'today':
          default:
            // Keep default values (today to today)
            break;
        }
      }

      // Get all performance metrics within date range
      const allMetrics = await storage.getPerformanceMetrics(undefined, from, to);

      // Calculate totals for current period
      const revenue = allMetrics.reduce((sum, metric) => sum + Number(metric.revenue), 0);
      const orders = allMetrics.reduce((sum, metric) => sum + metric.orders, 0);
      const totalPurchase = allMetrics.reduce((sum, metric) => sum + Number(metric.totalPurchase), 0);
      const profit = allMetrics.reduce((sum, metric) => sum + Number(metric.profit), 0);
      const roi = totalPurchase > 0 ? (profit / totalPurchase) * 100 : 0;

      // Calculate previous period for comparison
      const previousFrom = new Date(from);
      const previousTo = new Date(to);
      const periodDuration = to.getTime() - from.getTime();
      
      previousFrom.setTime(previousFrom.getTime() - periodDuration);
      previousTo.setTime(previousTo.getTime() - periodDuration);

      const previousMetrics = await storage.getPerformanceMetrics(undefined, previousFrom, previousTo);
      const previousRevenue = previousMetrics.reduce((sum, metric) => sum + Number(metric.revenue), 0);
      const previousOrders = previousMetrics.reduce((sum, metric) => sum + metric.orders, 0);
      const previousTotalPurchase = previousMetrics.reduce((sum, metric) => sum + Number(metric.totalPurchase), 0);
      const previousProfit = previousMetrics.reduce((sum, metric) => sum + Number(metric.profit), 0);
      const previousRoi = previousTotalPurchase > 0 ? (previousProfit / previousTotalPurchase) * 100 : 0;

      res.json({
        revenue,
        orders,
        totalPurchase,
        profit,
        roi,
        previousRevenue,
        previousOrders,
        previousTotalPurchase,
        previousProfit,
        previousRoi
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // ===== SHOPS ENDPOINTS =====
  apiRouter.get("/shops", async (req, res) => {
    try {
      const shops = await storage.getShops();
      res.json(shops);
    } catch (error) {
      console.error("Error fetching shops:", error);
      res.status(500).json({ error: "Failed to fetch shops" });
    }
  });

  apiRouter.post("/shops", async (req, res) => {
    try {
      const validatedData = insertShopSchema.parse(req.body);
      const newShop = await storage.createShop(validatedData);
      res.status(201).json(newShop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating shop:", error);
        res.status(500).json({ error: "Failed to create shop" });
      }
    }
  });

  apiRouter.get("/shops/:id", async (req, res) => {
    try {
      const shopId = parseInt(req.params.id);
      const shop = await storage.getShopById(shopId);
      
      if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
      }
      
      res.json(shop);
    } catch (error) {
      console.error("Error fetching shop:", error);
      res.status(500).json({ error: "Failed to fetch shop" });
    }
  });
  
  apiRouter.delete("/shops/:id", async (req, res) => {
    try {
      const shopId = parseInt(req.params.id);
      const success = await storage.deleteShop(shopId);
      
      if (!success) {
        return res.status(404).json({ error: "Shop not found" });
      }
      
      res.status(200).json({ success: true, message: "Shop successfully deleted" });
    } catch (error) {
      console.error("Error deleting shop:", error);
      res.status(500).json({ error: "Failed to delete shop" });
    }
  });

  apiRouter.patch("/shops/:id/profit-share", async (req, res) => {
    try {
      const shopId = parseInt(req.params.id);
      const { profitSharePercentage } = req.body;
      
      if (typeof profitSharePercentage !== 'number' || profitSharePercentage < 0 || profitSharePercentage > 100) {
        return res.status(400).json({ error: "Invalid profit share percentage" });
      }
      
      const updatedShop = await storage.updateShop(shopId, { profitSharePercentage });
      
      if (!updatedShop) {
        return res.status(404).json({ error: "Shop not found" });
      }
      
      res.json(updatedShop);
    } catch (error) {
      console.error("Error updating shop profit share:", error);
      res.status(500).json({ error: "Failed to update shop profit share" });
    }
  });

  apiRouter.get("/shops/:id/performance", async (req, res) => {
    try {
      const shopId = parseInt(req.params.id);
      const timeFilter = req.query.timeFilter as string || 'today';
      let from, to;

      if (req.query.from && req.query.to) {
        from = new Date(req.query.from as string);
        to = new Date(req.query.to as string);
      } else {
        // Calculate date range based on time filter
        const today = new Date();
        from = new Date(today);
        to = new Date(today);

        switch (timeFilter) {
          case 'yesterday':
            from.setDate(from.getDate() - 1);
            to.setDate(to.getDate() - 1);
            break;
          case '7d':
            from.setDate(from.getDate() - 7);
            break;
          case '30d':
            from.setDate(from.getDate() - 30);
            break;
          case 'mtd':
            from.setDate(1); // First day of current month
            break;
          case 'ytd':
            from.setMonth(0, 1); // January 1st of current year
            break;
          case 'today':
          default:
            // Keep default values (today to today)
            break;
        }
      }

      const shop = await storage.getShopById(shopId);
      
      if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
      }

      // Get today's metrics
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const todayMetrics = await storage.getPerformanceMetrics(shopId, todayStart, todayEnd);
      
      // Calculate today's totals
      const todayRevenue = todayMetrics.reduce((sum, metric) => sum + Number(metric.revenue), 0);
      const todayOrders = todayMetrics.reduce((sum, metric) => sum + metric.orders, 0);
      const todayProfit = todayMetrics.reduce((sum, metric) => sum + Number(metric.profit), 0);
      const todayRoi = todayMetrics.reduce((sum, metric) => sum + Number(metric.roi), 0) / Math.max(1, todayMetrics.length);

      // Get last 7 days metrics
      const last7Start = new Date();
      last7Start.setDate(last7Start.getDate() - 7);
      last7Start.setHours(0, 0, 0, 0);
      const last7End = new Date();
      last7End.setHours(23, 59, 59, 999);
      const last7Metrics = await storage.getPerformanceMetrics(shopId, last7Start, last7End);
      
      // Calculate last 7 days totals
      const last7Revenue = last7Metrics.reduce((sum, metric) => sum + Number(metric.revenue), 0);
      const last7Orders = last7Metrics.reduce((sum, metric) => sum + metric.orders, 0);
      const last7Profit = last7Metrics.reduce((sum, metric) => sum + Number(metric.profit), 0);
      const last7Roi = last7Metrics.reduce((sum, metric) => sum + Number(metric.roi), 0) / Math.max(1, last7Metrics.length);

      // Get last 30 days metrics
      const last30Start = new Date();
      last30Start.setDate(last30Start.getDate() - 30);
      last30Start.setHours(0, 0, 0, 0);
      const last30End = new Date();
      last30End.setHours(23, 59, 59, 999);
      const last30Metrics = await storage.getPerformanceMetrics(shopId, last30Start, last30End);
      
      // Calculate last 30 days totals
      const last30Revenue = last30Metrics.reduce((sum, metric) => sum + Number(metric.revenue), 0);
      const last30Orders = last30Metrics.reduce((sum, metric) => sum + metric.orders, 0);
      const last30Profit = last30Metrics.reduce((sum, metric) => sum + Number(metric.profit), 0);
      const last30Roi = last30Metrics.reduce((sum, metric) => sum + Number(metric.roi), 0) / Math.max(1, last30Metrics.length);

      // Format daily performance data
      const dailyPerformance = last7Metrics.map(metric => {
        const date = new Date(metric.date);
        return {
          date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          revenue: Number(metric.revenue),
          orders: metric.orders,
          cost: Number(metric.totalPurchase),
          profit: Number(metric.profit),
          roi: Number(metric.roi)
        };
      });

      // Sort by date descending
      dailyPerformance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      res.json({
        id: shop.id,
        name: shop.name,
        platform: shop.platform,
        region: shop.region,
        today: {
          revenue: todayRevenue,
          orders: todayOrders,
          profit: todayProfit,
          roi: todayRoi
        },
        lastSevenDays: {
          revenue: last7Revenue,
          orders: last7Orders,
          profit: last7Profit,
          roi: last7Roi
        },
        lastThirtyDays: {
          revenue: last30Revenue,
          orders: last30Orders,
          profit: last30Profit,
          roi: last30Roi
        },
        dailyPerformance
      });
    } catch (error) {
      console.error("Error fetching shop performance:", error);
      res.status(500).json({ error: "Failed to fetch shop performance" });
    }
  });

  // ===== AGENCY PROFIT ENDPOINTS =====
  apiRouter.get("/agency-profit", async (req, res) => {
    try {
      let from, to;

      if (req.query.from && req.query.to) {
        from = new Date(req.query.from as string);
        to = new Date(req.query.to as string);
      } else {
        // Default: current month
        const today = new Date();
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = today;
      }

      const shops = await storage.getShops();
      const allMetrics = await storage.getPerformanceMetrics(undefined, from, to);
      
      // Calculate totals and breakdowns
      let totalRevenue = 0;
      let totalAgencyProfit = 0;
      
      const storeProfitBreakdown = await Promise.all(shops.map(async (shop) => {
        const shopMetrics = allMetrics.filter(metric => metric.shopId === shop.id);
        
        const revenue = shopMetrics.reduce((sum, metric) => sum + Number(metric.revenue), 0);
        const costs = shopMetrics.reduce((sum, metric) => sum + Number(metric.totalPurchase), 0);
        const netProfit = revenue - costs;
        const profitSharePercentage = Number(shop.profitSharePercentage);
        const agencyProfit = (netProfit * profitSharePercentage) / 100;
        
        totalRevenue += revenue;
        totalAgencyProfit += agencyProfit;
        
        return {
          id: shop.id,
          name: shop.name,
          revenue,
          costs,
          netProfit,
          profitSharePercentage,
          agencyProfit
        };
      }));
      
      // Calculate average profit share percentage
      const avgProfitShare = shops.reduce((sum, shop) => sum + Number(shop.profitSharePercentage), 0) / shops.length;
      
      res.json({
        total: totalAgencyProfit,
        totalStores: shops.length,
        totalRevenue,
        avgProfitShare,
        storeProfitBreakdown
      });
    } catch (error) {
      console.error("Error calculating agency profit:", error);
      res.status(500).json({ error: "Failed to calculate agency profit" });
    }
  });

  // ===== CHART DATA ENDPOINT =====
  apiRouter.get("/chart-data", async (req, res) => {
    try {
      const timeFilter = req.query.timeFilter as string || '30d';
      let from, to;

      if (req.query.from && req.query.to) {
        from = new Date(req.query.from as string);
        to = new Date(req.query.to as string);
      } else {
        // Calculate date range based on time filter
        const today = new Date();
        from = new Date(today);
        to = new Date(today);

        switch (timeFilter) {
          case '7d':
            from.setDate(from.getDate() - 7);
            break;
          case 'mtd':
            from.setDate(1); // First day of current month
            break;
          case 'ytd':
            from.setMonth(0, 1); // January 1st of current year
            break;
          default: // Default to 30d
            from.setDate(from.getDate() - 30);
            break;
        }
      }

      // Get metrics for date range
      const metrics = await storage.getPerformanceMetrics(undefined, from, to);

      // Group metrics by date
      const groupedByDate = metrics.reduce((groups, metric) => {
        const date = new Date(metric.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!groups[date]) {
          groups[date] = {
            date,
            revenue: 0,
            orders: 0,
            profit: 0
          };
        }
        
        groups[date].revenue += Number(metric.revenue);
        groups[date].orders += metric.orders;
        groups[date].profit += Number(metric.profit);
        
        return groups;
      }, {});

      // Convert to array and sort by date
      const chartData = Object.values(groupedByDate).sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      res.json(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });
  
  // ===== GOOGLE SHEETS INTEGRATION =====
  apiRouter.post("/google-sheets/connect", async (req, res) => {
    try {
      const { apiKey, spreadsheetId, sheetName } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ 
          success: false, 
          message: "API key is required" 
        });
      }
      
      // Update the Google Sheets service configuration with just the API key
      // Using placeholder values for spreadsheetId and sheetName as they'll be set per shop
      googleSheetsService.updateConfig({
        apiKey,
        spreadsheetId: spreadsheetId || "placeholder",
        sheetName: sheetName || "placeholder"
      });
      
      try {
        // Validate the API key format (doesn't actually check with Google API)
        const isValid = await googleSheetsService.validateApiKey();
        
        if (isValid) {
          // If validation passes, store the API key globally
          process.env.GOOGLE_SHEETS_API_KEY = apiKey;
          
          console.log("Google Sheets API Key stored successfully");
          
          res.json({ 
            success: true, 
            message: "API key saved successfully" 
          });
        } else {
          console.error("Invalid Google Sheets API key format");
          res.status(400).json({ 
            success: false, 
            message: "Invalid API key format. Please check your Google Sheets API key." 
          });
        }
      } catch (validationError) {
        console.error("Error validating Google Sheets API key:", validationError);
        res.status(400).json({ 
          success: false, 
          message: "Could not validate Google Sheets API key. Please check your key." 
        });
      }
    } catch (error) {
      console.error("Error saving Google Sheets API key:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to save API key" 
      });
    }
  });

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}

import express from "express";
