// Vercel serverless function entry point
let app;

export default async function handler(req, res) {
  if (!app) {
    const { createApp } = await import('../dist/app.js');
    app = await createApp();
  }
  return app(req, res);
}
