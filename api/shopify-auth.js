// Shopify OAuth handler to get access token
// Visit /api/shopify-auth to start the OAuth flow

export default async function handler(req, res) {
  const SHOPIFY_STORE = 'light-by-dawn-candle-company';
  const CLIENT_ID = 'da0170242d780316fc79eb412c155282';
  const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
  const SCOPES = 'read_products,read_orders,read_inventory,write_inventory';

  // Get the host for redirect URI
  const host = req.headers.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const REDIRECT_URI = `${protocol}://${host}/api/shopify-auth`;

  // If we have a code, exchange it for a token
  if (req.query.code) {
    const { code, shop } = req.query;

    try {
      const tokenResponse = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code
        })
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
          <html>
            <head><title>Shopify Token</title></head>
            <body style="font-family: system-ui; padding: 40px; background: #1a1a2e; color: #eee;">
              <h1 style="color: #55efc4;">Success!</h1>
              <p>Your access token:</p>
              <pre style="background: #333; padding: 20px; border-radius: 8px; word-break: break-all;">${tokenData.access_token}</pre>
              <p style="color: #888;">Copy this token and give it to Claude to update your Vercel environment.</p>
              <p style="color: #888;">Scopes: ${tokenData.scope}</p>
            </body>
          </html>
        `);
      } else {
        return res.status(400).json({ error: 'Failed to get token', details: tokenData });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Start OAuth flow - redirect to Shopify
  const authUrl = `https://${SHOPIFY_STORE}.myshopify.com/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  res.redirect(302, authUrl);
}
