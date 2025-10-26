import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { log, serveStatic } from "./vite";

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

export async function createApp() {
  const app = express();

  app.use(express.json({
    limit: '50mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  }));

  app.use(express.urlencoded({ extended: false, limit: '50mb' }));

  // Serve static music files from wedding_music folder
  app.use('/wedding_music', express.static(path.join(process.cwd(), 'attached_assets', 'wedding_music')));
  
  // Serve static image files from wedding_images folder
  app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error('Error:', err);
  });

  // Serve static files in production
  if (app.get("env") !== "development") {
    serveStatic(app);
  }

  return app;
}
