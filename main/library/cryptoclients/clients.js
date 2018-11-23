 Object.defineProperty(exports, "__esModule", {
    value: true
});

//Load fundamentals
const format = require('./format.js');
const async = require('async');

const handleData = (type, exchange, callback) => {
	console.log(type, exchange, callback)
	// dirty conditional because bittrex lib sends err, data inversely && res.result has data
	// todo: change lib to behave better
	if (exchange === 'bittrex') {
		return (res, err) => {
			if (err) {
				console.log(err);
				return callback(null, []);
			}

			var formattedData = format[type](res.result, exchange);
			callback(null, formattedData);
		}
	}
	else {

		return (err, data) => {
			if (err) {
				console.log(err);
				return callback(null, []);
			}

			var formattedData = format[type](data, exchange);
			callback(null, formattedData);
		}
	}
}




/*

METHODS, AVAILABL FOR CLIENTS
Todo objectify

*/
const methods = {
	'poloniex': (lib) => ({
		orders: (callback) => {
			lib.returnOpenOrders("all", handleData('orders', 'poloniex', callback))
		},
		balances: (callback) => {
			lib.returnCompleteBalances("exchange", handleData('balances', 'poloniex', callback))
		},
		trades: (callback) => {
			var t_1 = Math.floor(Date.now() / 1000);
			var t_0 = t_1 - 365*24*60*60;
			lib.returnMyTradeHistory('all', t_0, t_1, handleData('trades', 'poloniex', callback))
		},
		cancelOrder: (order, callback) => { return lib.cancelOrder(parseInt(order.id), callback)},
		passOrder: (order, callback) => {
			return lib[order.type](format.poloniex.to.pair(order.pair), order.rate, order.amount, false, false, false, callback);
		}
	}),
	'bittrex': (lib) => ({
		orders: (callback) => {
			lib.getopenorders({}, handleData('orders', 'bittrex', callback))
		},
		balances: (callback) => {
			lib.getbalances(handleData('balances', 'bittrex', callback))
		},
		trades: (callback) => {
			lib.getorderhistory({}, handleData('trades', 'bittrex', callback))
		},
		cancelOrder: (order, callback) => { 
			return lib.cancel({uuid: order.id}, (res, err) => { return callback(err, res)})
		},
		passOrder: (order, callback) => {
			var orderMethod = order.type + 'limit'; //buylimit or selllimit
			var formattedOrder = format.bittrex.to.order(order);
			lib[orderMethod](formattedOrder, function (data, err) {
				console.log(err, data);
				return callback(err, data);
			})
		}
	}),
	'bitfinex': (lib) => ({
		orders: (callback) => {
			lib.rest(1).active_orders(handleData('orders', 'bitfinex', callback))
		},
		balances: (callback) => {
			lib.rest().balances(handleData('balances', 'bitfinex', callback))
		},
		trades: (callback) => {
			lib.rest(1).orders_history(handleData('trades', 'bitfinex', callback))
		},
		cancelOrder: (order, callback) => { return lib.rest(1).cancel_order(order.id, callback) },
		passOrder: (order, callback) => {
			var formattedOrder = format.bitfinex.to.order(order);
			lib.rest(1).new_order(
				formattedOrder.pair, 
				formattedOrder.amount, 
				formattedOrder.rate, 
				'bitfinex', 
				order.type, 
				'exchange limit', 
				callback
			);
		}
	}),
	'bitstamp': (lib) => ({
		orders: (callback) => {
			const get = async () => {
				const data = await lib.rest.openOrdersAll().then(({body:data}) => data);
				var formattedData = format['orders'](data, 'bitstamp');
				return formattedData;
			}
			var data = get().then((data) => callback(null, data));
		},
		balances: (callback) => {
			console.log('ok')
			const get = async () => {
				const data = await lib.rest.balance().then(({body:data}) => data);
				var formattedData = format['balances'](data, 'bitstamp');
				return formattedData;
			}
			var data = get().then((data) => callback(null, data));
		},	
		trades: (callback) => {
			const get = async () => {
				const data = await lib.rest.userTransaction().then(({body:data}) => data);
				var formattedData = format['trades'](data, 'bitstamp');
				return formattedData;
			}
			var data = get().then((data) => callback(null, data));
		},
		cancelOrder: (order, callback) => {
			const get = async () => {
				const data = await lib.rest.cancelOrder(order.id);
				return data;
			}
			var data = get().then((data) => callback(null, data)).catch((err) => callback(err));
		},
		passOrder: (order, callback) => {
			order = format.bitstamp.to.order(order);
			const get = async () => {
				const data = await lib.rest[`${order.type}LimitOrder`](order.amount, order.price, order.pair);
			}
			var data = get().then((data) => callback(null, data)).catch((err) => callback(err));
		}
	}),
	binance: (lib) => ({
		orders: (callback) => {
			lib.openOrders(false, handleData('orders', 'binance', callback));
		},
		balances: (callback) => {
			lib.balance(handleData('balances', 'binance', callback));
		},
		trades: (callback) => {
			//to do when binance api allows to fetch all trades at once

			// binance.trades("SNMBTC", (error, trades, symbol) => {
			//   console.log(symbol+" trade history", trades);
			// });
			return callback(null, []);
		},
		cancelOrder: (order, callback) => {
			order = format.binance.to.order(order);
			//console.log(order);
			lib.cancel(order.pair, order.id, (err, res, symbol) => {
				console.log(err, res, symbol)
				callback(err, res);
			})
		},
		passOrder: (order, callback) => {
			order = format.binance.to.order(order);
			lib[order.type](order.pair, order.amount, order.rate, {type:'LIMIT'}, callback);
		},
	}),
	kraken: (lib) => ({
		orders: (callback) => {
			const get = async () => {
				const res = await lib.api('OpenOrders');
				if (res.error) {
					console.log(res.error);
					return [];
				}

				const formattedOrders = format['orders'](res.result, 'kraken');
				return formattedOrders;
			}
			get().then((data) => callback(null, data)).catch((err) => callback(err));
		},
		balances: (callback) => {
			const get = async () => {
				const res = await lib.api('Balance');
				if (res.error) console.log(res.error);

				const formattedBalances = format['balances'](res.result, 'kraken');
				return formattedBalances;
			}
			get().then((data) => callback(null, data)).catch((err) => callback(err));
		},
		trades: (callback) => {
			const get = async () => {
				const res = await lib.api('TradesHistory');
				if (res.error) console.log(res.error);

				const formattedTrades = format['trades'](res.result.trades, 'kraken');
				return formattedTrades;
			}
			get().then((data) => callback(null, data)).catch((err) => callback(err));
		},
		cancelOrder: (order, callback) => {
			const cancel = async () => {
				const res = await lib.api('CancelOrder', {txid: order.id});
				return res.result;
			}
			cancel().then((data) => callback(null, data));
		},
		passOrder: (order, callback) => {
			order = format.kraken.to.order(order);
			console.log(order);
			const pass = async () => {
				const res = await lib.api('AddOrder', order);
				if (res.error) {
					throw new Error(res.error.join(', '));
				}
				else {
					return res.result;
				}
			}
			pass().then((data) => callback(null, data)).catch(callback);
		},
	})
}

class Clients {
	constructor (options) {
		this.credentials = options.credentials; //"credentials":{"binance":{"apikey":"","apisecret":""},"bitfinex":{"apikey":"","apisecret":""},"bittrex":{"apikey":"","apisecret":""},"kraken":{"apikey":"a","apisecret":"b"},"poloniex":{"apikey":"","apisecret":""}}}
		this.methods = methods;
		
		this.exchanges = Object.keys(this.credentials).filter(e => { if(options.credentials[e].apikey) return e; })
		this.libraries = this.exchanges.map((e) => {

			var o = options.credentials[e];

			console.log(o);

			switch (e) {
				case 'poloniex':
					const p = require('poloniex-api-node');
					return new p(o.apikey, o.apisecret, { socketTimeout: 15000, version: 2});
				case 'bittrex':
					const t = require('node-bittrex-api'); 
					t.options(o); 
					return t; 
				case 'bitfinex':
					const f = require('bitfinex-api-node');
					return new f({apiKey: o.apikey, apiSecret: o.apisecret, ws: {autoReconnect: true}})
				case 'bitstamp':
					const s = require('node-bitstamp');
					const restClient = new s.Bitstamp({
						key: o.apikey,
						secret: o.apisecret,
						clientId: 940448,
						timeout: 5000,
					})
					const lib = Object.assign({rest: restClient},s);
					return lib
				case 'binance':
					const Binance = require('node-binance-api');
					const instance = new Binance().options({
					  APIKEY: o.apikey,
					  APISECRET: o.apisecret,
					  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
					  test: (process.env.NODE_ENV === "development")?true:false // If you want to use sandbox mode where orders are simulated
					});
					return instance;
				case 'kraken':
					const Kraken = require('./exchanges/kraken');
					const instanceKraken = new Kraken(o.apikey, o.apisecret)
					return instanceKraken;
				default:
					return null
			}
		})
	}

	get(methodName, exchange) {
		const key = this.exchanges.indexOf(exchange);
		if (key >= 0) {
			return this.methods[exchange](this.libraries[key])[methodName]
		}
		else return this.exchanges.map((exchange, i) => this.methods[exchange](this.libraries[i])[methodName])
	}

	getAll() {
		return this.exchanges.map((exchange, i) => this.methods[exchange](this.libraries[i]))
	}

	getAsync(methodName, callback) {
		return async.parallel(this.get(methodName), (err, results) => {
			if (err) console.log(err);
			results = format.flatten(results);
			callback(err, results);
		});
	}

	isValidOrder(order) {
		console.log('Pass Order', order);
		return (
			(order.type === 'buy' || order.type === 'sell') &&
			order.rate > 0 &&
			order.amount > 0 &&
			this.exchanges.includes(order.exchange) //check that exchange is connected
		)
	}

	passOrder (order, callback) {
    //if order has symbol and no exchange+pair fields
    if (order.symbol && !order.exchange && !order.pair) {
      [order.exchange, order.pair] = order.symbol.split(':');
    }
		return this.isValidOrder(order) ? this.get('passOrder', order.exchange)(order, callback) : callback(new Error('Order is invalid'));
	}

	passOrders (orders, callback) {
		return async.map(orders, this.passOrder.bind(this), callback);
	}
}


// const getTradesSummary = (trades) => {
// 	var summary = {"totalAmount": {"buy": 0, "sell": 0}, "totalValue": {"buy": 0, "sell": 0}, "averagePrice": {}};
// 	if (trades.length) {
// 		trades.forEach((trade) => {
// 			summary.totalAmount[trade.type] += trade.amount;
// 			summary.totalValue[trade.type] += (trade.amount * trade.rate);
// 		})
// 		summary.averagePrice["buy"] = summary.totalValue["buy"] / summary.totalAmount["buy"];
// 		summary.averagePrice["sell"] = summary.totalValue["sell"] / summary.totalAmount["sell"];
// 	}
// 	return summary;
// }

exports.default = Clients;
module.exports = exports['default'];