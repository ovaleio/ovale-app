Object.defineProperty(exports, "__esModule", {
    value: true
});

var format = {};
const coins = require('./coins.json');

format = {
	"bittrex": {
		to: {
			url: (pair) => { return `https://bittrex.com/Market/Index?MarketName=${pair}`},
			order: (order) => {
				return {
					market: order.pair,
					quantity: order.amount,
					rate: order.rate,
					exchange: 'bittrex'
				}
			}
		},
		from: {
			currency: (currency) => {
				Object.keys(coins).map((formattedCurrency,i) => {
					if (currency == coins[formattedCurrency].bittrex) {
						currency = formattedCurrency;
					}
				});
				return currency;
			},
			pair: (pair) => { return pair},
			orderType: (e) => { return e.replace(/LIMIT_(SELL|BUY)/i, "$1").toLowerCase()}
		}
	},
	"bitfinex": {
		"to": {
			url: (pair) => { return `https://www.bitfinex.com/t/${pair.replace("-", ":")}`},
			symbol: (pair) => { return pair.replace("-", "").toLowerCase(); },
			pair: (pair) => { return pair.replace(/^(\w{3})-(\w{3})/, '$2$1').toLowerCase(); },
			order: (order) => {
				return {
					pair: order.pair.replace(/^(\w{3})-(\w{3})/, '$2$1').toLowerCase(),
					amount: order.amount.toString(),
					rate: order.rate.toString(),
					exchange: 'bitfinex'
				}
			}
		},
		"from": {
			"currency": (currency) => {
				return currency.toUpperCase();
			},
			"symbol": (pair) => {
				return pair.replace(/^(\w{3})(\w{3})$/, '$2-$1').toUpperCase()
			},
			pair: (pair) => { return pair.replace(/^(\w{3})(\w{3})$/, '$2-$1').toUpperCase(); },
		}
	},
	"poloniex": {
		to: {
			pair: (e) => { return e.replace("-", "_")},
			url: (pair) => { return `https://poloniex.com/exchange#${pair.replace("-", "_").toLowerCase()}`}
		},
		from: {
			pair: (e) => { return e.replace("_", "-")}
		}
	},
	"bitstamp": {
		to: {
			pair: (pair) => { return pair.replace(/^(\w{3})-(\w{3})/, '$2$1').toLowerCase() },
			order: (order) => { 
				return {
					amount: parseFloat(order.amount),
					price: parseFloat(order.rate),
					pair: order.pair.replace(/^(\w{3})-(\w{3})/, '$2$1').toLowerCase(),
					type: order.type
				}
			}
		},
		from: {
			currency: (currency) => currency.toUpperCase(),
			pair: (pair) => { return pair.replace(/^(\w{3})\/?(\w{3})$/, '$2-$1').toUpperCase(); }
		}
	},
	"hitbtc": {
		from: {
			pair: (e) => { return e.replace(/^(\w+)(\w{3})$/, "$1-$2")}
		}
	},
	"binance": {
		from: {
			pair: (e) => { return e.replace(/^(\w+)(BNB|BTC|ETH|USDT)$/, "$2-$1")}
		},
		to: {
			order: (order) => {
				console.log(order);
				return {
					amount: parseFloat(order.amount),
					rate: parseFloat(order.rate),
					pair: order.pair.replace(/^(\w+)-(\w+)/, '$2$1'),
					type: order.type,
					id: order.id
				}
			}
		}
	},
}

format.flatten = (obj) => {
	var a = [];
	Object.keys(obj).map((key, i) => { a = a.concat(obj[key]); });
	return a;
}

format.orders = function (orders, exchange) {
	var formattedOrders = [];
	switch (exchange) {
		case 'bittrex':
			formattedOrders = orders.map((order,i) => ({
				"pair": order.Exchange,
				"type": format.bittrex.from.orderType(order.OrderType),
				"exchange": "bittrex",
				"amount": order.Quantity,
				"remainingAmount": order.QuantityRemaining,
				"rate": order.Limit,
				"date": new Date(order.Opened),
				"id": order.OrderUuid
			}))
		break;

		case 'poloniex':

			Object.keys(orders).map((e, i) => {
				formattedOrders = orders[e].map((order) => ({
					"pair": format.poloniex.from.pair(e),
					"type": order.type,
					"exchange": "poloniex",
					"amount": parseFloat(order.startingAmount),
					"remainingAmount": parseFloat(order.amount),
					"rate": parseFloat(order.rate),
					"date": new Date(order.date),
					"id": order.orderNumber
				}))
			})
			break;

		case 'bitfinex':
			formattedOrders = orders.map((order,i) => ({
				"pair": format.bitfinex.from.symbol(order.symbol),
				"type": order.side, //type should be limit or market, not buy or sell, todo
				"exchange": 'bitfinex',
				"amount": parseFloat(order.original_amount),
				"remainingAmount": parseFloat(order.remaining_amount),
				"rate": parseFloat(order.price),
				"date": new Date(parseInt(order.timestamp) * 1000),
				"id": order.id
			}))
			break;
		case 'bitstamp':
			formattedOrders = orders.map((order, i) => ({
				"pair": format.bitstamp.from.pair(order.currency_pair),
				"type": order.type === '1' ? 'sell' : 'buy',
				"exchange": 'bitstamp',
				"amount": parseFloat(order.amount),
				"rate": parseFloat(order.price),
				"date": new Date(order.datetime),
				"id": order.id 
			}) );
			break;

		case 'binance':
			formattedOrders = orders.map((order, i) => ({
				"pair": format.binance.from.pair(order.symbol),
				"type": order.side.toLowerCase(),
				"exchange": 'binance',
				"amount": parseFloat(order.origQty),
				"rate": parseFloat(order.price),
				"date": new Date(order.time),
				"id": order.orderId 
			}) );
			break;
	}

	formattedOrders.forEach((e) => { e.symbol = e.exchange + ':' + e.pair}); //e.g. bitfinex:BTC-USD

	return formattedOrders;
}

format.balances = function (balances, exchange) {
	var formattedBalances = [];

	if (!balances) return false;

	switch (exchange) {
		case 'bittrex':
			balances.map((balance, i) => {
				if (balance.Balance > 0) {
					var formattedBalance = {
						"ticker": "bittrex:" + format.bittrex.from.currency(balance.Currency),
						"currency": format.bittrex.from.currency(balance.Currency),
						"exchange": "bittrex",
						"balance": balance.Balance,
						"available": balance.Available,
						"pending": balance.Pending
					}
					formattedBalances.push(formattedBalance);
				}
			})
			break;

		case 'poloniex':
			Object.keys(balances).map((currency, i) => {
				var balance = {};
				//parse float all elements
				Object.keys(balances[currency]).map((field) => {
					balance[field] = parseFloat(balances[currency][field]);
				});

				//filter empty balance
				if (balance.available > 0.0) {
					var formattedBalance = {
						"ticker": "poloniex:" + currency,
						"currency": currency,
						"exchange": "poloniex",
						"balance": balance.available + balance.onOrders,
						"available": balance.available,
						"pending": ""
					}
					formattedBalances.push(formattedBalance);
				}
			})
			break;

		case 'bitfinex':
			balances.map((balance, i) => {
				var formattedBalance = {
					"ticker": "bitfinex:" + format.bitfinex.from.currency(balance.currency),
					"currency": format.bitfinex.from.currency(balance.currency),
					"exchange": "bitfinex",
					"type": balance.type,
					"balance": parseFloat(balance.amount),
					"available": parseFloat(balance.available),

				}
				if (formattedBalance.balance > 0) formattedBalances.push(formattedBalance);
			});
			break;

		case 'bitstamp':
			const b = Object.keys(balances).reduce((accumulator, key) => {
				var matches = key.match(/^(\w{3})_(available|balance)$/);
				if (matches) {
					accumulator[matches[1]] = Object.assign({}, accumulator[matches[1]], { [matches[2]]: parseFloat(balances[key]) });
				}
				return accumulator
			}, {})

			Object.keys(b).map((currency) => {
				var formattedBalance = {
					"ticker": "bitstamp:" + format.bitstamp.from.currency(currency),
					"currency": format.bitstamp.from.currency(currency),
					"exchange": "bitstamp",
					"balance": b[currency].balance,
					"available": b[currency].available,
				}
				if (formattedBalance.balance > 0) formattedBalances.push(formattedBalance);
			})
			break;

		case 'binance':
			Object.keys(balances).map((currency, i) => {
				var balance = {};
				//parse float all elements
				Object.keys(balances[currency]).map((field) => {
					balance[field] = parseFloat(balances[currency][field]);
				});

				//filter empty balance
				if (balance.available > 0.0) {
					var formattedBalance = {
						"ticker": "binance:" + currency,
						"currency": currency,
						"exchange": "binance",
						"balance": balance.available + balance.onOrder,
						"available": balance.available,
						"pending": ""
					}
					formattedBalances.push(formattedBalance);
				}
			})
			break;
	}

	const baseCurrency = 'BTC'

	formattedBalances.forEach((e) => { 

		if (e.currency === baseCurrency || e.currency.match(/USD/)) {
			var fiatCurrency = (e.exchange === 'bittrex' || e.exchange === 'poloniex') ? 'USDT' : 'USD';
			var pair = fiatCurrency + '-' + baseCurrency;
		} else {
			var pair = baseCurrency + '-' + e.currency
		}

		e.symbol = e.exchange + ':' + pair 
	}); //e.g. bitfinex:USD-BTC, bittrex:USDT-BTC

	return formattedBalances;
}

format.tickers = function(tickers, exchange) {
	var formattedTickers = []; //how to handle multiple exchanges?

	switch (exchange) {
		case 'bittrex':
			tickers.map((ticker, i) => {
				formattedTickers[i] = {
					"pair": ticker.MarketName,
					"exchange": "bittrex",
					"high": ticker.High,
					"low": ticker.Low,
					"volume": ticker.Volume,
					"last": ticker.Last,
					"bid": ticker.Bid,
					"ask": ticker.Ask,
					"time": ticker.TimeStamp
				}
			})
			break;
		case 'poloniex':
			Object.keys(tickers).map((e,i) => {
				var ticker = tickers[e];
				var formattedTicker = {
					"pair": format.poloniex.from.pair(e),
					"exchange": "poloniex",
					"high": parseFloat(ticker.high24hr),
					"low": parseFloat(ticker.low24hr),
					"volume": parseFloat(ticker.baseVolume), //or base volume ?
					"last": parseFloat(ticker.last),
					"bid": parseFloat(ticker.highestBid),
					"ask": parseFloat(ticker.lowestAsk),
					"time": Date.now() //not very accurate
				}
				formattedTickers.push(formattedTicker);
			})
			break;
		case 'hitbtc':
			Object.keys(tickers).map((e,i) => {
				var ticker = tickers[e];
				if (e.last) {
					var formattedTicker = {
						"pair": format.hitbtc.from.pair(e),
						"exchange": "hitbtc",
						"high": parseFloat(ticker.high),
						"low": parseFloat(ticker.low),
						"volume": parseFloat(ticker.volume),
						"last": parseFloat(ticker.last),
						"bid": parseFloat(ticker.bid),
						"ask": parseFloat(ticker.ask),
						"time": ticker.timestamp //not very accurate
					}
					formattedTickers.push(formattedTicker);
				}
			})
			break;
		case 'bitstamp':
			formattedTickers.push([]);
			break;
	}

	return formattedTickers;
}

// format.consolidateTickers = (tickers) => {
// 	var consolidatedTickers = {};
// 	const weights = {"bittrex": 3, "poloniex": 4, "bitfinex": 10};

// 	Object.keys(tickers).forEach((exchange) => {
// 		tickers[exchange].forEach(e => {
// 			const pair = e.pair;
// 			if (consolidatedTickers[pair]) {
// 				const newConsolidatedTicker = {
// 					averagePrice: (consolidatedTickers[pair].averagePrice * consolidatedTickers[pair].totalVolume + e.last * e.volume) / (consolidatedTickers[pair].totalVolume + e.volume),
// 					sources: consolidatedTickers[pair].sources.concat(e.exchange),
// 					totalVolume: consolidatedTickers[pair].totalVolume + e.volume
// 				};
// 				consolidatedTickers[pair] = newConsolidatedTicker;
// 			} else {
// 				consolidatedTickers[pair] = {
// 					averagePrice: e.last,
// 					sources: [e.exchange],
// 					totalVolume: e.volume
// 				}
// 			}
// 		})
// 	});

// 	return consolidatedTickers;
// }

format.trades = function(trades, exchange, pair) {
	var formattedTrades = []; //how to handle multiple exchanges?

	if (!trades) return formattedTrades;

	switch (exchange) {
		case 'bittrex':
			trades.map((trade, i) => {
				formattedTrades[i] = {
					"symbol": exchange + ':' + trade.Exchange,
					"pair": trade.Exchange,
					"exchange": exchange,
					"date": new Date(trade.TimeStamp),
					"type": format.bittrex.from.orderType(trade.OrderType),
					"amount": trade.Quantity,
					"remainingAmount": trade.QuantityRemaining,
					"rate": trade.PricePerUnit,
					"fee": trade.Commission
				}
			})
			break;
		case 'poloniex':
			Object.keys(trades).map((pair, i) => {
				trades[pair].forEach((trade) => {
					if (trade.category == "exchange") {
						var _pair = format.poloniex.from.pair(pair);
						var formattedTrade = {
							"symbol": exchange + ':' + _pair,
							"pair": _pair,
							"exchange": exchange,
							"date": new Date(trade.date),
							"type": trade.type,
							"amount": parseFloat(trade.amount),
							"remainingAmount": parseFloat(trade.remainingAmount) || 0,
							"rate": parseFloat(trade.rate),
							"fee": parseFloat(trade.fee)
						};
						formattedTrades.push(formattedTrade);
					}
				})
			})
			break;
		case 'bitfinex':
			trades.map((trade, i) => {
				if (trade.tid && pair) {
					//handle past trade differently
					var formattedTrade = {
						"symbol": exchange + ':' + pair,
						"pair": pair,
						"exchange": exchange,
						"date": new Date(parseInt(trade.timestamp) * 1000),
						"type": trade.type.toLowerCase(),
						"amount": parseFloat(trade.amount),
						"remainingAmount": 0,
						"rate": parseFloat(trade.price),
						"fee": parseFloat(trade.fee_amount) * -1
					}
					formattedTrades.push(formattedTrade);
				}
				else if ((trade.type == 'exchange limit' || trade.type == 'exchange market') && !trade.is_cancelled) {
					var pair = format.bitfinex.from.pair(trade.symbol);
					var formattedTrade = {
						"symbol": exchange + ':' + pair,
						"pair": pair,
						"exchange": exchange,
						"date": new Date(parseInt(trade.timestamp) * 1000),
						"type": trade.side,
						"amount": parseFloat(trade.original_amount),
						"remainingAmount": parseFloat(trade.remaining_amount),
						"rate": parseFloat(trade.avg_execution_price),
						"fee": parseFloat(trade.executed_amount) * 0.001
					}
					formattedTrades.push(formattedTrade);
				}
			})
			break;
		case 'bitstamp':
			console.log(trades)
			break;
	}

	//compute total amount of btc for each trade
	formattedTrades.forEach((t) => {t.total = t.amount * t.rate});

	return formattedTrades;
}

exports.default = format;
module.exports = exports['default'];