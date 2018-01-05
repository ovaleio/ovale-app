# CryptoTrader

CryptoTrader is a unified trading client for cryptocurrency exchanges.

![screenshot](https://github.com/johnthillaye/cryptotrader-app/raw/master/assets/screen_cryptotrader.png)

## Exchanges supported

- Bitfinex
- Bittrex
- Poloniex

## How to configure

Create a `config.json` file in a `.cryptotrader` folder in your home directory:
`mkdir ~/.cryptotrader`
`nano ~/.cryptotrader/config.json`

Add your `apikey` & `apisecret` for the exchanges you want to connect to, as shown below:

````
{
    "credentials": {
        "bitfinex": {
			"apikey": "",
			"apisecret": ""
        },
        "bittrex": {
			"apikey" : "",
			"apisecret" : "",
        },
        "poloniex": {
			"apikey": "",
			"apisecret": ""
        }
    },
    "dbUrl": "mongodb://localhost:27017",
    "dbName": "cryptotrader"
}
````


/!\ Warning: Do not give withdrawal privileges to your apikeys. We are not responsible for any rogue use of your keys.


## How to run

Make sure you have node 8+ installed. You can check this by running `node -v` in your shell.

Clone this repo:
`git clone https://github.com/johnthillaye/cryptotrader-app`

Enter the directory:
`cd cryptotrader-app`

Install dependencies
`npm install`

Launch the electron app
`npm start`

Make sure you have a websocket server to send the app tickers updates & keep orders, balances in sync with the exchanges. 

You can find one at https://github.com/johnthillaye/cryptotrader-server

## Dev mode

We use `cryptoclients`, a custom made library to connect to the various exchanges' API. If you need to customize it, you can clone it at `https://github.com/johnthillaye/cryptoclients`.
This library is also available via npm: `npm install cryptoclients`