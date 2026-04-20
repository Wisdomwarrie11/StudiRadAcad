import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🎬 Server script starting...");

const app = express();
const PORT = 3000;

console.log("⚙️ Middleware setup...");
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString()
  });
});

// Move Vite setup inside a function and handle errors
async function initializeAppServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("🛠️ Initializing Vite in development mode...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log("📦 Serving static files in production mode...");
      const distPath = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.use('/assets', express.static(distPath));
        app.get('*', (req, res, next) => {
          if (req.path.startsWith('/api') || req.path.includes('.')) {
            return next();
          }
          res.sendFile(path.join(distPath, 'index.html'));
        });
      } else {
        console.warn("⚠️ Warning: dist directory not found. Static serving might fail.");
      }
    }
  } catch (error) {
    console.error("❌ Failed to initialize app server:", error);
  }
}

// Start initialization
initializeAppServer();

// Global error handler for Express
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("GLOBAL SERVER ERROR:", err);
  res.status(500).json({ 
    error: "A global server error occurred", 
    message: err.message,
    path: req.path
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// Only start listening if this file is run directly (not as a serverless function)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA || process.env.FUNCTION_NAME;

if (!isServerless) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
  });
} else {
  console.log("🚀 Server running in serverless mode.");
}

export default app;
