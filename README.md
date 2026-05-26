# Romantic Invite Website + Live Chat

Romantic invite page with a private live Socket.IO chat and Telegram notification on invite click. The chat is ephemeral and not stored anywhere.

## Local development

1. Copy `.env.example` to `.env` in the project root and fill in your Telegram values.
2. Start the backend (which also serves the client locally):

```
cd server
npm install
npm start
```

Open `http://localhost:5000` in your browser.

## Frontend config (Vercel-ready)

The client is a plain static site in the `client` folder. It reads the backend base URL from `client/config.js`:

```
window.APP_CONFIG = {
  API_BASE_URL: "https://your-render-service.onrender.com"
};
```

For local dev, this file can stay as `http://localhost:5000`.

## Deploy backend to Render

1. Create a new **Web Service** in Render.
2. Set the **Root Directory** to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set these environment variables in Render:
   - `PORT` (Render sets this automatically)
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `FRONTEND_URL` (your Vercel app URL, e.g. `https://your-app.vercel.app`)
6. Deploy and note the Render URL, e.g. `https://your-render-service.onrender.com`.

Health check: `https://your-render-service.onrender.com/health`

## Deploy frontend to Vercel

1. Create a new Vercel project.
2. Set the **Root Directory** to `client`.
3. Before deploying, update `client/config.js` to use your Render URL:

```
API_BASE_URL: "https://your-render-service.onrender.com"
```

4. Deploy the project.

## Test production

1. Visit your Vercel URL and verify the invite button works.
2. Open the site in two browsers and use the same room code.
3. Confirm messages and images appear instantly.
4. Refresh or close one browser and verify the chat clears.
