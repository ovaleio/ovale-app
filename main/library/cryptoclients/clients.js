 Object.defineProperty(exports, "__esModule", {
    value: true
});

//Load fundamentals
const format = require('./format.js');
const async = require('async');
const os = require('os');
const path = require('path');
const fs = require('fs');

const handleData = (type, exchange, callback) => {
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
				console.log(order);
				const data = await lib.rest[`${order.type}LimitOrder`](order.amount, order.price, order.pair);
			}
			var data = get().then((data) => callback(null, data)).catch((err) => callback(err));
		}
	})
}

class Clients {
	constructor (options) {
		this.supportedExchanges = options.supportedExchanges || ['bitfinex', 'poloniex', 'bittrex', 'bitstamp'];
		this.methods = methods

		this.exchanges = this.supportedExchanges.filter(e => options.credentials[e] && options.credentials[e].apikey)
		this.libraries = this.exchanges.map((e) => {
			var o = options.credentials[e];
			switch (e) {
				case 'poloniex':
					const p = require('poloniex-api-node');
					return new p(o.apikey, o.apisecret, { socketTimeout: 15000, version: 2});
				case 'bittrex':
					const t = require('node.bittrex.api'); 
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
			results = format.flatten(results);
			callback(err, results);
		});
	}

	isValidOrder(order) {
		console.log('d', order);
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