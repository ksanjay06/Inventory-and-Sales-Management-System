import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "inventory_db.json");

// Default initial database content
const DEFAULT_DB = {
  users: [
    {
      id: "usr_owner1",
      email: "owner@example.com",
      password: "password",
      name: "Jane Doe (Owner)",
      role: "owner"
    },
    {
      id: "usr_sales1",
      email: "sales@example.com",
      password: "password",
      name: "Alex Smith (Sales)",
      role: "sales"
    }
  ],
  products: [
    {
      id: "prod_1",
      name: "MacBook Pro M3 Max",
      sku: "APP-MBP-XM3",
      category: "Electronics",
      costPrice: 2200,
      sellingPrice: 2999,
      stock: 12,
      minStockAlert: 5,
      createdAt: "2026-05-15T10:00:00.000Z"
    },
    {
      id: "prod_2",
      name: "Logitech MX Master 3S",
      sku: "LGT-MX3S",
      category: "Accessories",
      costPrice: 55,
      sellingPrice: 99,
      stock: 35,
      minStockAlert: 10,
      createdAt: "2026-05-16T11:30:00.000Z"
    },
    {
      id: "prod_3",
      name: "Keychron Q1 Pro Mechanical Keyboard",
      sku: "KCH-Q1P",
      category: "Accessories",
      costPrice: 110,
      sellingPrice: 189,
      stock: 4,
      minStockAlert: 8,
      createdAt: "2026-05-18T14:15:00.000Z"
    },
    {
      id: "prod_4",
      name: "Dell UltraSharp 27\" U2723QE",
      sku: "DEL-US27",
      category: "Electronics",
      costPrice: 280,
      sellingPrice: 399,
      stock: 15,
      minStockAlert: 5,
      createdAt: "2026-05-19T09:00:00.000Z"
    },
    {
      id: "prod_5",
      name: "Ergonomic Adjustable Standing Desk",
      sku: "FUR-ESD7",
      category: "Furniture",
      costPrice: 210,
      sellingPrice: 399,
      stock: 3,
      minStockAlert: 5,
      createdAt: "2026-05-20T16:45:00.000Z"
    },
    {
      id: "prod_6",
      name: "Sony WH-1000XM5 Noise Cancelling Headphones",
      sku: "SON-XM5",
      category: "Electronics",
      costPrice: 180,
      sellingPrice: 299,
      stock: 20,
      minStockAlert: 6,
      createdAt: "2026-05-21T13:20:00.000Z"
    }
  ],
  transactions: [
    {
      id: "tx_1",
      products: [
        {
          productId: "prod_2",
          name: "Logitech MX Master 3S",
          quantity: 2,
          priceSpent: 99,
          costPrice: 55
        },
        {
          productId: "prod_4",
          name: "Dell UltraSharp 27\" U2723QE",
          quantity: 1,
          priceSpent: 399,
          costPrice: 280
        }
      ],
      totalAmount: 597,
      totalCost: 390,
      profit: 207,
      salespersonId: "usr_sales1",
      salespersonName: "Alex Smith (Sales)",
      customerName: "Acme Corporated",
      createdAt: "2026-05-28T14:32:00.000Z"
    },
    {
      id: "tx_2",
      products: [
        {
          productId: "prod_1",
          name: "MacBook Pro M3 Max",
          quantity: 1,
          priceSpent: 2999,
          costPrice: 2200
        }
      ],
      totalAmount: 2999,
      totalCost: 2200,
      profit: 799,
      salespersonId: "usr_sales1",
      salespersonName: "Alex Smith (Sales)",
      customerName: "Julian V.",
      createdAt: "2026-05-30T09:12:00.000Z"
    },
    {
      id: "tx_3",
      products: [
        {
          productId: "prod_2",
          name: "Logitech MX Master 3S",
          quantity: 5,
          priceSpent: 99,
          costPrice: 55
        }
      ],
      totalAmount: 495,
      totalCost: 275,
      profit: 220,
      salespersonId: "usr_owner1",
      salespersonName: "Jane Doe (Owner)",
      customerName: "Inloop Retail",
      createdAt: "2026-06-01T16:45:00.000Z"
    }
  ],
  logs: [
    {
      id: "log_init_1",
      productId: "prod_1",
      productName: "MacBook Pro M3 Max",
      quantityChange: 12,
      previousStock: 0,
      newStock: 12,
      type: "product_created",
      reason: "Initial listing uploaded",
      user: "System Seeder",
      createdAt: "2026-05-15T10:00:00.000Z"
    },
    {
      id: "log_init_2",
      productId: "prod_3",
      productName: "Keychron Q1 Pro Mechanical Keyboard",
      quantityChange: 4,
      previousStock: 0,
      newStock: 4,
      type: "product_created",
      reason: "Initial listing uploaded",
      user: "System Seeder",
      createdAt: "2026-05-18T14:15:00.000Z"
    },
    {
      id: "log_tx_1_prod_2",
      productId: "prod_2",
      productName: "Logitech MX Master 3S",
      quantityChange: -2,
      previousStock: 37,
      newStock: 35,
      type: "sale",
      reason: "Deduction for Sale #tx_1",
      user: "Alex Smith (Sales)",
      createdAt: "2026-05-28T14:32:00.000Z"
    },
    {
      id: "log_tx_1_prod_4",
      productId: "prod_4",
      productName: "Dell UltraSharp 27\" U2723QE",
      quantityChange: -1,
      previousStock: 16,
      newStock: 15,
      type: "sale",
      reason: "Deduction for Sale #tx_1",
      user: "Alex Smith (Sales)",
      createdAt: "2026-05-28T14:32:00.000Z"
    },
    {
      id: "log_tx_2_prod_1",
      productId: "prod_1",
      productName: "MacBook Pro M3 Max",
      quantityChange: -1,
      previousStock: 13,
      newStock: 12,
      type: "sale",
      reason: "Deduction for Sale #tx_2",
      user: "Alex Smith (Sales)",
      createdAt: "2026-05-30T09:12:00.000Z"
    },
    {
      id: "log_tx_3_prod_2",
      productId: "prod_2",
      productName: "Logitech MX Master 3S",
      quantityChange: -5,
      previousStock: 40,
      newStock: 35,
      type: "sale",
      reason: "Deduction for Sale #tx_3",
      user: "Jane Doe (Owner)",
      createdAt: "2026-06-01T16:45:00.000Z"
    }
  ]
};

// Helper to load DB
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("DB corrupted, rewriting default...", error);
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

// Helper to save DB
function saveDB(data: typeof DEFAULT_DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Get current user context based on custom headers to check role restrictions
  const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = req.headers["x-user-id"] as string;
    const userRole = req.headers["x-user-role"] as string;
    const userName = req.headers["x-user-name"] as string;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Missing authentication state in request headers" });
    }

    (req as any).user = {
      id: userId,
      role: userRole as "owner" | "sales",
      name: userName || "Anonymous"
    };
    next();
  };

  // Type definition for request extension
  // Express' Request needs custom properties
  // (We cast to `any` or extend inside routing)

  // API 1: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = loadDB();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return user details (excluding password)
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  });

  // API 2: Register
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "All fields (email, password, name, role) are required" });
    }

    if (role !== "owner" && role !== "sales") {
      return res.status(400).json({ error: "Invalid role specified. Must be 'owner' or 'sales'" });
    }

    const db = loadDB();
    const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "A user with this email address already exists" });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase(),
      password,
      name,
      role: role as "owner" | "sales"
    };

    db.users.push(newUser);
    saveDB(db);

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });
  });

  // API 3: Get all products
  app.get("/api/products", authMiddleware, (req, res) => {
    const db = loadDB();
    res.json(db.products);
  });

  // API 4: Add Product (Owner only)
  app.post("/api/products", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    if (authUser.role !== "owner") {
      return res.status(403).json({ error: "Forbidden: Restricted to administrators/owners" });
    }

    const { name, sku, category, costPrice, sellingPrice, stock, minStockAlert } = req.body;
    if (!name || !sku || !category || costPrice === undefined || sellingPrice === undefined || stock === undefined) {
      return res.status(400).json({ error: "Missing required product properties" });
    }

    const db = loadDB();
    // Validate unique SKU
    const skuConflict = db.products.some((p) => p.sku.toUpperCase() === sku.toUpperCase());
    if (skuConflict) {
      return res.status(400).json({ error: "A product with this SKU already exists" });
    }

    const newProduct = {
      id: `prod_${Date.now()}`,
      name,
      sku: sku.toUpperCase(),
      category,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock),
      minStockAlert: Number(minStockAlert || 5),
      createdAt: new Date().toISOString()
    };

    db.products.push(newProduct);

    // Write initial log
    const log = {
      id: `log_${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      quantityChange: newProduct.stock,
      previousStock: 0,
      newStock: newProduct.stock,
      type: "product_created" as const,
      reason: "Initial listing listing setup",
      user: authUser.name,
      createdAt: new Date().toISOString()
    };
    db.logs.unshift(log);

    saveDB(db);
    res.status(201).json(newProduct);
  });

  // API 5: Update Product or Adjust Stock (Owner only)
  app.put("/api/products/:id", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    if (authUser.role !== "owner") {
      return res.status(403).json({ error: "Forbidden: Restricted to administrators/owners" });
    }

    const { id } = req.params;
    const { name, sku, category, costPrice, sellingPrice, stock, minStockAlert, adjustReason } = req.body;

    const db = loadDB();
    const productIdx = db.products.findIndex((p) => p.id === id);
    if (productIdx === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingProduct = db.products[productIdx];

    // Check SKU uniqueness if changed
    if (sku && sku.toUpperCase() !== existingProduct.sku) {
      const skuConflict = db.products.some((p) => p.id !== id && p.sku.toUpperCase() === sku.toUpperCase());
      if (skuConflict) {
        return res.status(400).json({ error: "SKU conflict: This SKU is already in use by another product" });
      }
    }

    const oldStock = existingProduct.stock;
    const newStockVal = stock !== undefined ? Number(stock) : oldStock;

    // Check if stock is updated manually, generate an inventory log
    if (newStockVal !== oldStock) {
      const change = newStockVal - oldStock;
      const log = {
        id: `log_${Date.now()}`,
        productId: id,
        productName: name || existingProduct.name,
        quantityChange: change,
        previousStock: oldStock,
        newStock: newStockVal,
        type: (change > 0 ? "restock" : "manual_adjust") as "restock" | "manual_adjust",
        reason: adjustReason || (change > 0 ? "Restocked inventory manually" : "Manual stock correction"),
        user: authUser.name,
        createdAt: new Date().toISOString()
      };
      db.logs.unshift(log);
    }

    // Update fields
    const updatedProduct = {
      ...existingProduct,
      name: name || existingProduct.name,
      sku: sku ? sku.toUpperCase() : existingProduct.sku,
      category: category || existingProduct.category,
      costPrice: costPrice !== undefined ? Number(costPrice) : existingProduct.costPrice,
      sellingPrice: sellingPrice !== undefined ? Number(sellingPrice) : existingProduct.sellingPrice,
      stock: newStockVal,
      minStockAlert: minStockAlert !== undefined ? Number(minStockAlert) : existingProduct.minStockAlert
    };

    db.products[productIdx] = updatedProduct;
    saveDB(db);

    res.json(updatedProduct);
  });

  // API 6: Delete Product (Owner only)
  app.delete("/api/products/:id", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    if (authUser.role !== "owner") {
      return res.status(403).json({ error: "Forbidden: Restricted to administrators/owners" });
    }

    const { id } = req.params;
    const db = loadDB();
    const productExists = db.products.some((p) => p.id === id);
    if (!productExists) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Remove product
    db.products = db.products.filter((p) => p.id !== id);

    // Keep some trace logs or purge? Let's add a deletion logs
    const log = {
      id: `log_${Date.now()}`,
      productId: id,
      productName: `[Deleted] ${id}`,
      quantityChange: 0,
      previousStock: 0,
      newStock: 0,
      type: "manual_adjust" as const,
      reason: `Product listing deleted permanently`,
      user: authUser.name,
      createdAt: new Date().toISOString()
    };
    db.logs.unshift(log);

    saveDB(db);
    res.json({ success: true, message: "Product deleted successfully" });
  });

  // API 7: Record Sales Transaction (Any authenticated user can request)
  app.post("/api/transactions", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    const { products, customerName, customerPhone, paymentMethod } = req.body; // array of { productId, quantity }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Transactions must contain at least 1 product sale item" });
    }

    const db = loadDB();
    const pendingSales: any[] = [];
    let totalAmt = 0;
    let totalCst = 0;

    // Phase 1: Validate stock levels for all products in the cart in a transaction-like lock step
    for (const item of products) {
      const prod = db.products.find((p) => p.id === item.productId);
      if (!prod) {
        return res.status(404).json({ error: `Product with ID ${item.productId} was not found` });
      }

      const orderQty = Number(item.quantity);
      if (isNaN(orderQty) || orderQty <= 0) {
        return res.status(400).json({ error: `Invalid purchase quantity specified for ${prod.name}` });
      }

      if (prod.stock < orderQty) {
        return res.status(400).json({
          error: `Insufficient stock for '${prod.name}'. Requested ${orderQty}, but only ${prod.stock} are available.`
        });
      }

      pendingSales.push({
        product: prod,
        quantity: orderQty,
        prevStock: prod.stock
      });

      totalAmt += prod.sellingPrice * orderQty;
      totalCst += prod.costPrice * orderQty;
    }

    // Phase 2: Execution. Create transaction record & log stock updates
    const txId = `tx_${Date.now()}`;
    const txProducts: any[] = [];

    for (const sale of pendingSales) {
      const prod = sale.product;
      const qty = sale.quantity;

      // Deduct stock
      prod.stock -= qty;

      txProducts.push({
        productId: prod.id,
        name: prod.name,
        quantity: qty,
        priceSpent: prod.sellingPrice,
        costPrice: prod.costPrice
      });

      // Write stock deduction log
      db.logs.unshift({
        id: `log_${Date.now()}_${prod.id}`,
        productId: prod.id,
        productName: prod.name,
        quantityChange: -qty,
        previousStock: sale.prevStock,
        newStock: prod.stock,
        type: "sale",
        reason: `Automated stock deduction for sale #${txId}`,
        user: authUser.name,
        createdAt: new Date().toISOString()
      });
    }

    const profit = totalAmt - totalCst;

    const newTransaction = {
      id: txId,
      products: txProducts,
      totalAmount: totalAmt,
      totalCost: totalCst,
      profit: profit,
      salespersonId: authUser.id,
      salespersonName: authUser.name,
      customerName: customerName || "Guest Customer",
      customerPhone: customerPhone || "",
      paymentMethod: paymentMethod || "Cash",
      createdAt: new Date().toISOString()
    };

    db.transactions.unshift(newTransaction);
    saveDB(db);

    // Return the response. If Sales user, mask cost and profit inside returned transaction
    if (authUser.role === "sales") {
      const maskedTx = { ...newTransaction };
      delete (maskedTx as any).totalCost;
      delete (maskedTx as any).profit;
      maskedTx.products = maskedTx.products.map((p: any) => {
        const pCopy = { ...p };
        delete pCopy.costPrice;
        return pCopy;
      });
      return res.status(201).json(maskedTx);
    }

    res.status(201).json(newTransaction);
  });

  // API 8: Get sales transaction history (Role-based access)
  app.get("/api/transactions", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    const db = loadDB();

    // Owner gets full transactions
    if (authUser.role === "owner") {
      return res.json(db.transactions);
    }

    // Sales Users: "View their own sales history" + "Cannot access profit or financial analytics"
    const myTransactions = db.transactions.filter((tx) => tx.salespersonId === authUser.id);

    // Mask financial details (cost & profit) for security compliance
    const maskedTransactions = myTransactions.map((tx) => {
      const txCopy = { ...tx } as any;
      delete txCopy.totalCost;
      delete txCopy.profit;
      txCopy.products = txCopy.products.map((p: any) => {
        const pCopy = { ...p };
        delete pCopy.costPrice;
        return pCopy;
      });
      return txCopy;
    });

    res.json(maskedTransactions);
  });

  // API 9: Get stock modification logs (Owner only)
  app.get("/api/logs", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    if (authUser.role !== "owner") {
      return res.status(403).json({ error: "Forbidden: Restricted to owners only" });
    }

    const db = loadDB();
    res.json(db.logs);
  });

  // API 10: Clear Database / Factory Reset (Handy helper for evaluation!)
  app.post("/api/system/reset", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    if (authUser.role !== "owner") {
      return res.status(403).json({ error: "Forbidden" });
    }
    saveDB(JSON.parse(JSON.stringify(DEFAULT_DB)));
    res.json({ success: true, message: "Database resetted to factory state" });
  });

  // API 11: Clear Sales Reports & Profit History (Reset transactions only)
  app.post("/api/system/reset-transactions", authMiddleware, (req, res) => {
    const authUser = (req as any).user;
    if (authUser.role !== "owner") {
      return res.status(403).json({ error: "Forbidden: Restricted to owners only" });
    }
    const db = loadDB();
    db.transactions = [];
    if (Array.isArray(db.logs)) {
      db.logs = db.logs.filter((log: any) => log.type !== "sale");
    }
    saveDB(db);
    res.json({ success: true, message: "Sales reports and profit history cleared successfully" });
  });

  // Vite Integration & Static Asset serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Express middleware to serve raw index.html transformed by Vite in development
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(
          path.resolve(process.cwd(), "index.html"),
          "utf-8"
        );
        // Transform HTML with Vite plugins and client scripts injection
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n=============================================================`);
    console.log(`🚀 Server started successfully inside Cloud Sandbox Container!`);
    console.log(`📡 Port: ${PORT} (Internal to Container)`);
    console.log(`👉 Please use the "Development App URL" or the`);
    console.log(`   built-in browser preview frame in AI Studio to visit the site!`);
    console.log(`🚫 Note: http://localhost:3000 is internal to the container.`);
    console.log(`=============================================================\n`);
  });
}

startServer().catch((e) => {
  console.error("Critical: Failed to launch Express-Vite backend process!", e);
});
