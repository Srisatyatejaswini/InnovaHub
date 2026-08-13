# InnovaHub deployment notes

## Vercel

- Framework: Vite (frontend) + Express serverless API
- Build command: `cd frontend && npm ci && npm run build`
- Output directory: `frontend/dist`
- API entry: `api/index.js`

Set these Vercel environment variables:

- `MONGO_URI` = your MongoDB connection string
- `JWT_SECRET` = a long random secret
- `NODE_ENV` = `production`

The frontend uses same-origin `/api/...` requests in production. For local development, Vite proxies `/api` to `http://localhost:5000`.
