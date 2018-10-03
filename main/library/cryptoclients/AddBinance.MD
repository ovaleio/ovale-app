# Adding Binance to OVALE step by step

## Useful Links

[Create API Keys](https://www.binance.com/userCenter/createApi.html)
[Documentation](https://github.com/binance-exchange/binance-official-api-docs)

## main/websocket-server.js

First thing we need to do is to connect to *Binance WebSocket*, to get *tickers*

We have a `connectWs` object to which we add a `binance` method.
This method takes a lib as parameter, we'll just leave it empty for now:

```
'binance': (lib) => {
        
 }
```

So we need to find a lib for binance websocket, let's look at github.

This one looks good: https://github.com/jaggedsoft/node-binance-api

Let's add it to our modules

`npm install node-binance-api --save`

To init the library, according to the README we will have to use the code below:
```
const binance = require('node-binance-api')().options({
  APIKEY: '<key>',
  APISECRET: '<secret>',
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: true // If you want to use sandbox mode where orders are simulated
});
```

Let's see where we initialize the exchanges clients in the code.

We look at `initSockets`

This method takes `credentials` and `channels` as parameters.
`credentials` is an object containing our API keys
`channels` is an array, defaults to `['TICKERS']`

With the `credentials`, we initialize the exchanges clients with the `Client` class found in `library/cryptoclients/clients.js`

```
const Clients = new clients({credentials});
socketState = {
    status: Clients.exchanges.reduce((o, exchange) => {o[exchange] = false; return o; }, {}),
    channels: channels.reduce((o, channelName) => {o[channelName] = {data: {}, lastSent: 0}; return o;}, {})
};
```

This creates a `socketState` object where we will store metadata about the sockets and direct data received in websocket channels.

## cryptoclients/clients.js

So let's look at what happens when we call `new clients({credentials})`

The `Client` class takes an `options` object.

The first option we have already seen is `credentials`. It is *mandatory* to initalize the clients.
Another option is `supportedExchanges`, it can be useful to overwrite the `Client` lib supported exchanges to restrict them for instance.

```
this.supportedExchanges = options.supportedExchanges || ['bitfinex', 'poloniex', 'bittrex', 'bitstamp', 'binance'];
```

The `Client` library then initalises 3 properties: `methods`, `exchanges` and `libraries`

* `methods` is an object of exchange-specific common methods such as `orders` (get), `balances` (get), `passOrder` (push)
* `exchanges` is the list of exchanges to connect to, it's a filter of `supportedExchanges` checking that `credentials` are provided for the exchange.
* `libraries` is where we initialize the exchange-specific library via a `switch` statement


### Adding a exchange-specific library

We have already installed our library using `npm`, now let's import and initalize it.

In the `Clients` Class constructor, we add the following code in the `libraries` property mapping:

```
case 'binance':
	const Binance = require('node-binance-api');
	const instance = new Binance().options({
	  APIKEY: o.apikey,
	  APISECRET: o.apisecret,
	  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
	  test: false // If you want to use sandbox mode where orders are simulated
	});
	return instance;
```

Great! Now let's go back to `websocket-server.js`

## Connecting Binance Websocket

Now that we have a Binance library initialized with our API keys, we can connect to our websocket.

Look at what `initSockets` returns:
```
    return Clients.exchanges.map((e,i) => ({ exchange: e, ws: connectWS[e](Clients.libraries[i]) }) );
```

Kind of dirty huh... Let's take it step by step
We have an array of our "activated" exchanges in `Clients.exchanges`, we map over it to return an array of objects with the name of the `exchange` and... an open websocket connection `ws` returned by the `connectWs` method of exchange `e` and fed with the exchange library.

* gasps *
* take a breath *

Ok so let's dive in `connectWS` and add a method for Binance!

We want this method to:
* open a websocket
* subscribe to `tickers` channel(s)
* handle error and close events
* return the opened websocket

According to our Binance library we can use the code below and there is no event handlers..
```
binance.websockets.miniTicker(markets => {
  console.log(markets);
});
```

In `connectWS`:
```
    'binance': (lib) => {
        lib.websockets.miniTicker(handleTickerData.binance);
        return lib;
    }
```

We define a new `handleTickerData` method for Binance:
```
"binance": (markets, error) => {
      console.log(markets, error);
      Object.keys(markets).forEach((pair) => {
        updateTickers("binance", pair, markets[pair].close)
      })
    }
```

Let's test now, before we need to do one more thing -> add binance to our credentials

In `main/index.js` we have

```
function startIPCHandler() {
    global.credentials = settingsProvider.get('credentials') || settings.defaultSettings.credentials;
    global.firstOpening = settingsProvider.get('firstOpening') || settings.defaultSettings.firstOpening;
    global.websockets = HandleSockets.init();
    global.rest = HandleRest();
}
```

We will overwrite `global.credentials` for the test.

```
global.credentials = {"binance": {"apikey": "", "apisecret": ""}}
```

## Test

We are receiving Tickers !


```
{ BNBBTC: 
   { close: '0.00157850',
     open: '0.00150760',
     high: '0.00162210',
     low: '0.00150340',
     volume: '1848496.83000000',
     quoteVolume: '2893.12723837',
     eventTime: 1538569551975 },
```

## updateTickers

```
const updateTickers = (exchange, pair, price) => {
    pair = format[exchange].from.pair(pair);
    var symbol = exchange + ':' + pair;
    socketState.channels.TICKERS.data[symbol] = parseFloat(price); //write perf to check here
}
```

This method uses the `format` library of `cryptoclients`

We need to add methods for Binance in there

### format.js

We are trying to convert the `symbol` given by the exchange-specific library to OVALE format.
This is tricky in this case because there is no separator.
Example of symbols given by our binance lib: `LTCBTC`, `QTUMBTC`, `QTUMUSDT`, `DASHBTC`

The most reliable way here would be to use static mapping from our database `exchangeSymbols` table.

Let's use a regex in `format.js` for now, we capture the base currency first, it can be either `BNB`, `BTC`, `ETH`, or `USDT`


```
	"binance": {
		from: {
			pair: (e) => { return e.replace(/^(\w+)(BNB|BTC|ETH|USDT)$/, "$1-$2")}
		}
	}
```

## Adding REST Methods

Now that our websocket is all set, we need to add the rest methods for Binance in `clients.js` methods object

The OVALE app will ask for 'ORDERS' and 'BALANCES' asynchronously on start, so we need at least these two methods.

According to the Binance library :

### `orders`

```
binance.openOrders(false, (error, openOrders) => {
  console.log("openOrders()", openOrders);
});
```

### `balances`

```
binance.balance((error, balances) => {
  if ( error ) return console.error(error);
  console.log("balances()", balances);
  console.log("ETH balance: ", balances.ETH.available);
});
```

### `passOrder`

```
binance.buy("ETHBTC", quantity, price);
binance.sell("ETHBTC", quantity, price);
```

### `cancelOrder` (symbol, orderid)

```
binance.cancel("ETHBTC", orderid, (error, response, symbol) => {
  console.log(symbol+" cancel response:", response);
});
```

## In `clients.js`

Each sub-method takes a callback as a parameter, we return  `callback(err, res)`
The `handleData` helper returns a callback, it acts as a middleware formatting the data returned by exchange into the ovale format.


```
	binance: (lib) => ({
		orders: (callback) => {
			lib.openOrders(false, handleData('orders', 'binance', callback));
		},
		balances: (callback) => {
			lib.balance(handleData('balances', 'binance', callback));
		},
		trades: (callback) => {
			//to do
		},
		cancelOrder: (order, callback) => {
			order = format.binance.to.order(order);
			lib.cancel(order.symbol, order.id, (err, res, symbol) => {
				console.log(err, res, symbol)
				callback(err, res);
			})
		},
		passOrder: (order, callback) => {
			order = format.binance.to.order(order);
			lib[order.type](order.pair, order.amount, order.rate, {type:'LIMIT'}, callback);
		},
	})
```

## Almost Done ! We need to add an icon for our new exchange

Head to `renderer/components/ExchangesIcons.js`

Add the svg code for the exchangeIcon:

```
export const binanceIcon = (props) => (
	<SvgIcon color='#709B30' {...props}>
        <path d="M19,98.0393776 C23.4089345,102.551638 47.6257067,124.17836 85.6368074,99.0788582 C113.122739,78.3925014 112.436067,33.5435491 109.795601,20 C108.875749,21.9710397 76.9500095,89.5363128 19,98.0393776 Z M109,19.5083092 C108.66836,19.3737768 73.8348081,14.7101689 39.3989913,36.4902528 C18.0155055,50.0149581 15.1888713,69.8098351 16.1645172,83 C66.2238993,77.4989234 107.864448,21.059222 109,19.5083092 Z"></path>
	</SvgIcon>
);
```

# And voila ! We added an exchange to OVALE

## Clean up

1. Let's remove the dirty `global.credentials` overwrite in `main/index.js`

2. Add 'binance' in `supportedExchanges` array in `main/library/settings/defaultSettings.js`

3. Add `closeSockets` method in `websocket-server.js`

```
'binance': (lib) => null,
```

4. (Dev) Run `npm run reset` to reset the credentials and thus the `supportedExchanges` received by the `Settings` Component