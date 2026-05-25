# Romantic Invite Website

Romantic, pastel invitation landing page with a Telegram notification on button click.

## Setup

1. Create a Telegram bot via **@BotFather** and note the bot token.
2. Get your private chat ID (for example by messaging your bot and checking updates).
3. Create a `.env` file in the project root:

```
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
PORT=5000
```

## Run locally

```
cd server
npm install
npm start
```

Open `http://localhost:5000` in your browser.
