import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAuthUserSchema, insertAdminSchema, insertStoreSchema } from "@shared/schema";
import { createSlugFromText } from "../client/src/utils/slug";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const authUser = await storage.getAuthUserByLogin(email);
      if (!authUser || authUser.userType !== "admin") {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await storage.verifyPassword(password, authUser.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          type: "admin"
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/store/login", async (req, res) => {
    try {
      const { cnpj, password } = req.body;
      
      const store = await storage.getStoreByCnpj(cnpj);
      if (!store) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const authUser = await storage.getAuthUserByLogin(cnpj);
      if (!authUser || authUser.userType !== "store") {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await storage.verifyPassword(password, authUser.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({
        user: {
          id: store.id,
          name: store.name,
          type: "store",
          storeSlug: store.slug
        }
      });
    } catch (error) {
      console.error("Store login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Store routes
  app.post("/api/stores/register", async (req, res) => {
    try {
      const { cnpj, nome, subtitulo, corPrincipal, endereco, nomeResponsavel, senha } = req.body;
      
      // Check if store already exists
      const existingStore = await storage.getStoreByCnpj(cnpj);
      if (existingStore) {
        return res.status(400).json({ message: "CNPJ já cadastrado" });
      }
      
      const slug = createSlugFromText(nome);
      
      // Check if slug already exists
      const existingSlug = await storage.getStoreBySlug(slug);
      if (existingSlug) {
        return res.status(400).json({ message: "Nome da loja já existe. Escolha outro nome." });
      }
      
      // Create auth user
      const authUser = await storage.createAuthUser({
        login: cnpj,
        passwordHash: senha,
        userType: "store"
      });
      
      // Create store
      const store = await storage.createStore({
        cnpj,
        name: nome,
        slug,
        subtitle: subtitulo,
        primaryColor: corPrincipal,
        address: endereco,
        responsibleName: nomeResponsavel
      }, authUser.id);
      
      res.json({ store, slug });
    } catch (error) {
      console.error("Store registration error:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getAllStores();
      res.json(stores);
    } catch (error) {
      console.error("Get stores error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Subscription routes (replacing Supabase Edge Functions)
  app.get("/api/subscription/check", async (req, res) => {
    try {
      // For now, return mock subscription data
      // In a real implementation, this would check Stripe subscription status
      const mockSubscription = {
        hasSubscription: false,
        planType: "trial",
        clientCount: 3,
        basePrice: 29.99,
        extraClientsCharge: 0,
        totalMonthlyPrice: 29.99,
        canAddClients: true,
        subscriptionEnd: null
      };
      
      res.json(mockSubscription);
    } catch (error) {
      console.error("Check subscription error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/subscription/checkout", async (req, res) => {
    try {
      // Mock checkout URL - in real implementation this would create Stripe checkout session
      const mockCheckoutUrl = "https://checkout.stripe.com/mock-session";
      
      res.json({ url: mockCheckoutUrl });
    } catch (error) {
      console.error("Create checkout error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/subscription/customer-portal", async (req, res) => {
    try {
      // Mock customer portal URL - in real implementation this would create Stripe customer portal session
      const mockPortalUrl = "https://billing.stripe.com/mock-portal";
      
      res.json({ url: mockPortalUrl });
    } catch (error) {
      console.error("Customer portal error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Client routes
  app.post("/api/clients/login", async (req, res) => {
    try {
      const { phone, code } = req.body;
      
      // Mock SMS verification - in real implementation this would verify SMS code
      if (code !== "123456") {
        return res.status(401).json({ message: "Invalid verification code" });
      }
      
      // Find client by phone number
      // For now, return mock client data
      res.json({
        user: {
          id: "mock-client-id",
          phone,
          name: "Cliente Teste",
          type: "client"
        }
      });
    } catch (error) {
      console.error("Client login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
