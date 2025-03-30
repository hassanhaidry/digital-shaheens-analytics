import { pgTable, text, serial, integer, boolean, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: date("created_at").notNull().defaultNow(),
});

// Shop model
export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  region: text("region").notNull(),
  profitSharePercentage: numeric("profit_share_percentage").notNull().default("50"),
  sheetId: text("sheet_id"),
  sheetName: text("sheet_name"),
  createdAt: date("created_at").notNull().defaultNow(),
});

// Performance metrics model
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id").notNull().references(() => shops.id),
  date: date("date").notNull(),
  revenue: numeric("revenue").notNull().default("0"),
  orders: integer("orders").notNull().default(0),
  totalPurchase: numeric("total_purchase").notNull().default("0"),
  profit: numeric("profit").notNull().default("0"),
  roi: numeric("roi").notNull().default("0"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertShopSchema = createInsertSchema(shops).pick({
  name: true,
  platform: true,
  region: true,
  profitSharePercentage: true,
  sheetId: true,
  sheetName: true,
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).pick({
  shopId: true,
  date: true,
  revenue: true,
  orders: true,
  totalPurchase: true,
  profit: true,
  roi: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertShop = z.infer<typeof insertShopSchema>;
export type Shop = typeof shops.$inferSelect;

export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
