# OVALE 🛸

OVALE is a unified trading client for cryptocurrency exchanges.
OVALE operates under the GNU General Public License (GPL).

The OVALE Trading Client makes calls to a server for user login and data management.
By default the server endpoint configuration is `https://api.ovale.io/`

The server repo is located at https://github.com/ovaleio/ovale-api

![https://i.imgur.com/28uE32d.png](https://i.imgur.com/28uE32d.png)

## Exchanges supported

- Bitfinex
- Bittrex
- Poloniex
- Binance
- Kraken

## How to build the app

Make sure you have node 8+ installed. You can check this by running `node -v` in your shell.

Clone this repo:
`git clone https://github.com/ovaleio/ovale-app`

Enter the directory:
`cd ovale-app`

Install dependencies
`npm install`

Launch the electron app in dev mode
`npm start`

Build for production
`npm run dist`
