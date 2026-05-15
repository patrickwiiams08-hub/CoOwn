# CoOwn Fractional Asset Marketplace

CoOwn is a front-end prototype for a fractional asset marketplace. It lets users browse highlighted assets, inspect simulated stock-like price charts, buy and sell shares, upload their own assets, and login as an admin to approve or feature listings.

> Demo only: this is not a production securities exchange, broker-dealer, custody system, or legal compliance implementation.

## Chosen name

I chose **CoOwn** from the requested options because it immediately explains the product: people can co-own assets by purchasing smaller fractions.

## Demo admin access

- Email: `admin@coown.test`
- Password: `Admin123!`

## Features

- Fractional asset marketplace with seeded test assets.
- Stock-like trade desk with a canvas price chart.
- Demand-based appreciation algorithm using views, watchlists, trades, utilization, scarcity, and recent momentum.
- Buy/sell flow that updates available shares, simulated volume, price history, and user holdings.
- Login system backed by browser `localStorage` for demo users.
- Asset upload form with image URL or local image file upload.
- Admin panel to approve, feature, hide, or delete assets.
- Highlighted/trending items based on featured status and demand.

## Run it on your computer

You only need Python 3 or any static web server. If you are starting from a generated zip file, unzip it first.

```bash
unzip coown-marketplace.zip -d coown-marketplace
cd coown-marketplace
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

If you have Node.js installed, you can also run:

```bash
npm start
```

## Create the zip file

The zip archive is intentionally not committed to git because pull requests do not support binary zip files here. Generate it locally from the project folder when you need to share or install the site.

From the project folder, run:

```bash
zip -r coown-marketplace.zip index.html styles.css app.js README.md package.json assets -x '*.DS_Store'
```

Or, if Node.js is installed:

```bash
npm run zip
```

## Pricing algorithm overview

The prototype calculates a current market price with this simplified model:

```text
price = baseSharePrice × (1 + demandScore + utilization + momentum + scarcity)
```

Signals used:

- `demandScore`: page views, watchlist saves, and completed trades.
- `utilization`: percentage of shares already purchased.
- `momentum`: recent price movement from the price history array.
- `scarcity`: limited remaining share supply.

This lets assets appreciate when marketplace demand rises while still keeping the experience understandable in a demo.
