// Vercel Serverless Function - Shopify API Proxy
// Handles CORS and keeps API token secure

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'light-by-dawn-candle-company';
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Shopify access token not configured' });
  }

  const { endpoint, limit = 50, since_id, status, created_at_min } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  // Build query string
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  if (since_id) params.append('since_id', since_id);
  if (status) params.append('status', status);
  if (created_at_min) params.append('created_at_min', created_at_min);

  const url = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/${endpoint}.json?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Shopify API error',
        status: response.status,
        message: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Shopify fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Shopify', message: error.message });
  }
}
