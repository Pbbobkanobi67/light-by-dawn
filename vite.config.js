import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Local API handler plugin for development
function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/shopify')) {
          // Parse URL and query params
          const url = new URL(req.url, 'http://localhost');
          const params = Object.fromEntries(url.searchParams);

          // Create mock req/res for the handler
          const mockReq = {
            method: req.method,
            query: params,
            body: null
          };

          // Handle POST body
          if (req.method === 'POST') {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            try {
              mockReq.body = JSON.parse(Buffer.concat(chunks).toString());
            } catch (e) {
              mockReq.body = {};
            }
          }

          const mockRes = {
            statusCode: 200,
            headers: {},
            setHeader(key, value) {
              this.headers[key] = value;
              res.setHeader(key, value);
            },
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(data) {
              res.statusCode = this.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end() {
              res.statusCode = this.statusCode;
              res.end();
            }
          };

          // Dynamically import and run the handler
          try {
            const { default: handler } = await import('./api/shopify.js');
            await handler(mockReq, mockRes);
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for server-side API handler
  const env = loadEnv(mode, process.cwd(), '');

  // Make env vars available to the API handler
  process.env.SHOPIFY_ACCESS_TOKEN = env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ACCESS_TOKEN;
  process.env.SHOPIFY_STORE = env.SHOPIFY_STORE || process.env.SHOPIFY_STORE;

  return {
    plugins: [react(), localApiPlugin()],
  };
})
