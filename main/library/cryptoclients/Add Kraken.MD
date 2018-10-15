# Add Kraken

Kraken doesn't offer a webservice so we will have to fake it via setInterval rest calls.

Let's say every 5 seconds for Tickers

We will use `kraken-api` module, a lightweight promise-based library.

```
    'kraken': (lib) => {
        const getTicker = async () => {
            const res = lib.api('Ticker');
            console.log(res);
        }
        getTicker();
        return lib;
    }
```

Kraken is annoying because we need to feed a list of symbols

Add 'kraken' in `supportedExchanges`
Add library instantiation:

```
case 'kraken':
	const Kraken = require('kraken-api');
	const instance = new KrakenClient(o.apikey, o.apisecret)
	return instance;
```

In `websocket-server.js`

Add handleTickerData method.

In `index.js`, overwrite global credentials for test

```
global.credentials = {"kraken": {"apikey": "", apisecret: ""}}
```


