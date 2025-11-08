import { createApp } from "./app";
import { setupVite, log } from "./vite";
import { createServer, Server } from "http";
import { AddressInfo } from "net";

interface ServerConfig {
  port: number;
  host: string;
  env: string;
}

class WeddingServer {
  private server: Server | null = null;
  private config: ServerConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): ServerConfig {
    const port = parseInt(process.env.PORT || "5000", 10);
    const host = process.env.HOST || "0.0.0.0";
    const env = process.env.NODE_ENV || "development";

    return { port, host, env };
  }

  private validateConfig(): void {
    const { port } = this.config;
    
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid port number: ${port}`);
    }
  }

  private setupErrorHandlers(): void {
    if (!this.server) return;

    this.server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        this.printError(`Port ${this.config.port} is already in use`, "Please use a different port");
      } else {
        this.printError("Server error", error.message);
      }
      process.exit(1);
    });

    process.on("SIGINT", this.gracefulShutdown.bind(this));
    process.on("SIGTERM", this.gracefulShutdown.bind(this));
  }

  private async gracefulShutdown(): Promise<void> {
    this.printMessage("yellow", "🛑", "Received shutdown signal", "Gracefully shutting down server...");
    
    if (this.server) {
      this.server.close(() => {
        this.printMessage("green", "✅", "Server stopped", "All connections closed");
        process.exit(0);
      });

      setTimeout(() => {
        this.printError("Forcing server shutdown", "Timeout reached");
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  }

  private printBanner(): void {
    console.log("\n" + "=".repeat(60));
    console.log("🎊".padEnd(25) + "WEDDING SITE SERVER".padEnd(25) + "🎊");
    console.log("=".repeat(60) + "\n");
  }

  private printMessage(color: "green" | "yellow" | "blue", emoji: string, title: string, message: string = ""): void {
    const colors = {
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      gray: "\x1b[90m",
      reset: "\x1b[0m"
    };
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors[color]}${emoji}  ${title.padEnd(25)} ${message} ${colors.reset}${colors.gray}[${timestamp}]${colors.reset}`);
  }

  private printError(title: string, message: string = ""): void {
    const red = "\x1b[31m";
    const gray = "\x1b[90m";
    const reset = "\x1b[0m";
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`\n${red}❌  ${title}${reset}`);
    console.log(`   ${message}${gray} [${timestamp}]${reset}\n`);
  }

  private logServerStart(address: AddressInfo): void {
    const protocol = this.config.env === "development" ? "http" : "https";
    const host = address.address === "::" ? "localhost" : address.address;
    
    this.printBanner();
    
    this.printMessage("green", "🚀", "Server Started Successfully");
    console.log();
    this.printMessage("blue", "📍", "Server URL", `${protocol}://${host}:${address.port}`);
    this.printMessage("blue", "📊", "Environment", this.config.env);
    this.printMessage("blue", "⚡", "Server Mode", this.config.env === "development" ? "Development (Vite)" : "Production");
    this.printMessage("blue", "⏰", "Started at", new Date().toLocaleString());
    console.log();
    console.log("=".repeat(60));
    console.log();
  }

  public async start(): Promise<void> {
    try {
      this.validateConfig();
      
      this.printMessage("blue", "🔧", "Initializing server", "Wedding Site Server...");
      
      const app = await createApp();
      this.server = createServer(app);

      if (this.config.env === "development") {
        this.printMessage("yellow", "⚡", "Setting up Vite", "Hot reload enabled");
        await setupVite(app, this.server);
      }

      this.setupErrorHandlers();

      return new Promise((resolve, reject) => {
        this.server!.listen(this.config.port, this.config.host, () => {
          const address = this.server!.address() as AddressInfo;
          this.logServerStart(address);
          resolve();
        });

        this.server!.on("error", reject);
      });

    } catch (error) {
      this.printError(
        "Failed to start server", 
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }
}

// Add colors to global console
const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
  reset: "\x1b[0m"
};

// Main execution
(async (): Promise<void> => {
  try {
    const server = new WeddingServer();
    await server.start();
  } catch (error) {
    console.log(`\n${colors.red}💥  Fatal error during server startup:${colors.reset}`);
    console.log(`   ${error instanceof Error ? error.message : error}`);
    console.log();
    process.exit(1);
  }
})();