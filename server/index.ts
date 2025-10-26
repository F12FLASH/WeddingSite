import { createApp } from "./app";
import { setupVite, log } from "./vite";

(async () => {
  try {
    const app = await createApp();
    
    // Only setup Vite in development
    let server;
    if (app.get("env") === "development") {
      server = await import('http').then(m => m.createServer(app));
      await setupVite(app, server);
    } else {
      server = await import('http').then(m => m.createServer(app));
    }

    const port = parseInt(process.env.PORT || '5000', 10);
    
    server.listen(port, '0.0.0.0', () => {
      log(`🚀 Wedding site server running on http://0.0.0.0:${port}`);
      log(`📊 Environment: ${app.get("env")}`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`❌ Port ${port} is already in use. Try a different port.`);
        process.exit(1);
      } else {
        log(`❌ Server error: ${error.message}`);
        process.exit(1);
      }
    });

    // Handle shutdown signals
    process.on('SIGINT', () => {
      log('🛑 Shutting down server...');
      server.close(() => {
        log('✅ Server stopped');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();