import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
  authUsers, 
  admins, 
  stores, 
  clients, 
  products, 
  orders, 
  orderItems, 
  subscriptions,
  type AuthUser, 
  type InsertAuthUser,
  type Admin,
  type InsertAdmin,
  type Store,
  type InsertStore,
  type Client,
  type InsertClient,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Subscription,
  type InsertSubscription,
  // Legacy compatibility
  users,
  type User,
  type InsertUser
} from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // Legacy user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Auth methods
  createAuthUser(user: InsertAuthUser): Promise<AuthUser>;
  getAuthUserByLogin(login: string): Promise<AuthUser | undefined>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  
  // Admin methods
  createAdmin(admin: InsertAdmin, authId: string): Promise<Admin>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getAllStores(): Promise<Store[]>;
  
  // Store methods
  createStore(store: InsertStore, authId: string): Promise<Store>;
  getStoreBySlug(slug: string): Promise<Store | undefined>;
  getStoreByCnpj(cnpj: string): Promise<Store | undefined>;
  getStoreById(id: string): Promise<Store | undefined>;
  updateStoreClientCount(storeId: string, count: number): Promise<void>;
  
  // Client methods
  createClient(client: InsertClient): Promise<Client>;
  getClientsByStore(storeId: string): Promise<Client[]>;
  getClientByPhone(phone: string, storeId: string): Promise<Client | undefined>;
  
  // Product methods
  createProduct(product: InsertProduct): Promise<Product>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByStore(storeId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  
  // Order item methods
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItemsByOrder(orderId: string): Promise<OrderItem[]>;
  
  // Subscription methods
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByStore(storeId: string): Promise<Subscription | undefined>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription>;
}

export class DatabaseStorage implements IStorage {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Legacy user methods for compatibility
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Auth methods
  async createAuthUser(user: InsertAuthUser): Promise<AuthUser> {
    const hashedPassword = await this.hashPassword(user.passwordHash);
    const result = await db.insert(authUsers).values({
      ...user,
      passwordHash: hashedPassword
    }).returning();
    return result[0];
  }

  async getAuthUserByLogin(login: string): Promise<AuthUser | undefined> {
    const result = await db.select().from(authUsers).where(eq(authUsers.login, login));
    return result[0];
  }

  // Admin methods
  async createAdmin(admin: InsertAdmin, authId: string): Promise<Admin> {
    const result = await db.insert(admins).values({
      ...admin,
      authId
    }).returning();
    return result[0];
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.email, email));
    return result[0];
  }

  async getAllStores(): Promise<Store[]> {
    return db.select().from(stores);
  }

  // Store methods
  async createStore(store: InsertStore, authId: string): Promise<Store> {
    const result = await db.insert(stores).values({
      ...store,
      authId
    }).returning();
    return result[0];
  }

  async getStoreBySlug(slug: string): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.slug, slug));
    return result[0];
  }

  async getStoreByCnpj(cnpj: string): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.cnpj, cnpj));
    return result[0];
  }

  async getStoreById(id: string): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return result[0];
  }

  async updateStoreClientCount(storeId: string, count: number): Promise<void> {
    await db.update(stores).set({ clientCount: count }).where(eq(stores.id, storeId));
  }

  // Client methods
  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async getClientsByStore(storeId: string): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.storeId, storeId));
  }

  async getClientByPhone(phone: string, storeId: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(
      and(eq(clients.phone, phone), eq(clients.storeId, storeId))
    );
    return result[0];
  }

  // Product methods
  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async getProductsByStore(storeId: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.storeId, storeId));
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const result = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrdersByStore(storeId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.storeId, storeId));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
  }

  // Order item methods
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(item).returning();
    return result[0];
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Subscription methods
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(subscription).returning();
    return result[0];
  }

  async getSubscriptionByStore(storeId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.storeId, storeId));
    return result[0];
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const result = await db.update(subscriptions).set(updates).where(eq(subscriptions.id, id)).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
