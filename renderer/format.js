var format = {};
// var coins = require('./coins.json');

format = {
	"bittrex": {
		to: {
			url: (pair) => { return `https://bittrex.com/Market/Index?MarketName=${pair}`},
			order: (order) => {
				return {
					market: order.pair,
					quantity: order.amount,
					rate: order.rate
				}
			}
		},
		from: {
			// currency: (currency) => {
			// 	Object.keys(coins).map((formattedCurrency,i) => {
			// 		if (currency == coins[formattedCurrency].bittrex) {
			// 			currency = formattedCurrency;
			// 		}
			// 	});
			// 	return currency;
			// },
			pair: (pair) => { return pair},
			orderType: (e) => { return e.replace(/LIMIT_(SELL|BUY)/i, "$1").toLowerCase()}
		}
	},
	"bitfinex": {
		"to": {
			url: (pair) => { return `https://www.bitfinex.com/t/${pair.replace("-", ":")}`},
			symbol: (pair) => { return pair.replace("-", "").toLowerCase(); },
			order: (order) => {
				return {
					pair: order.pair.replace(/^(\w{3})-(\w{3})/, '$2$1').toLowerCase(),
					amount: order.amount.toString(),
					rate: order.rate.toString()
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
	"hitbtc": {
		from: {
			pair: (e) => { return e.replace(/^(\w+)(\w{3})$/, "$1-$2")}
		}
	}
}

format.flatten = (obj) => {
	var a = [];
	Object.keys(obj).map((key, i) => { a = a.concat(obj[key]); });
	return a;
}

format.orders = function (orders, exchange) {
	//todo: add autodetection, format more data
	var formattedOrders = [];

	switch (exchange) {
		case 'bittrex':
			orders.map((order,i) => {
				var formattedOrder =  {
					"pair": order.Exchange,
					"type": format.bittrex.from.orderType(order.OrderType),
					"exchange": "bittrex",
					"amount": order.Quantity,
					"remainingAmount": order.QuantityRemaining,
					"rate": order.Limit,
					"date": new Date(order.Opened),
					"id": order.OrderUuid
				}
				formattedOrders.push(formattedOrder);
			})
			break;

		case 'poloniex':

			Object.keys(orders).map((e, i) => {
				var ordersPerPair = orders[e];
				ordersPerPair.map((order) => {
					var formattedOrder = {
						"pair": format.poloniex.from.pair(e),
						"type": order.type,
						"exchange": "poloniex",
						"amount": parseFloat(order.startingAmount),
						"remainingAmount": parseFloat(order.amount),
						"rate": parseFloat(order.rate),
						"date": new Date(order.date),
						"id": order.orderNumber
					}
					formattedOrders.push(formattedOrder);
				})
			})
			break;

		case 'bitfinex':
			orders.map((order,i) => {
				var formattedOrder =  {
					"pair": format.bitfinex.from.symbol(order.symbol),
					"type": order.side, //type should be limit or market, not buy or sell, todo
					"exchange": 'bitfinex',
					"amount": parseFloat(order.original_amount),
					"remainingAmount": parseFloat(order.remaining_amount),
					"rate": parseFloat(order.price),
					"date": new Date(parseInt(order.timestamp) * 1000),
					"id": order.id
				}
				formattedOrders.push(formattedOrder);
			})
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
				if (balance.btcValue > 0.0) {
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
	}

	const baseCurrency = 'BTC'

	formattedBalances.forEach((e) => { 

		if (e.currency === baseCurrency) {
			var pair = 'USD-' + baseCurrency;
		} else {
			var pair = baseCurrency + '-' + e.currency
		}

		e.symbol = e.exchange + ':' + pair 
	}); //e.g. bitfinex:BTC-USD

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
	}

	return formattedTickers;
}

format.consolidateTickers = (tickers) => {
	let consolidatedTickers = {};
	const weights = {"bittrex": 3, "poloniex": 4, "bitfinex": 10};

	Object.keys(tickers).forEach((exchange) => {
		tickers[exchange].forEach(e => {
			const pair = e.pair;
			if (consolidatedTickers[pair]) {
				const newConsolidatedTicker = {
					averagePrice: (consolidatedTickers[pair].averagePrice * consolidatedTickers[pair].totalVolume + e.last * e.volume) / (consolidatedTickers[pair].totalVolume + e.volume),
					sources: consolidatedTickers[pair].sources.concat(e.exchange),
					totalVolume: consolidatedTickers[pair].totalVolume + e.volume
				};
				consolidatedTickers[pair] = newConsolidatedTicker;
			} else {
				consolidatedTickers[pair] = {
					averagePrice: e.last,
					sources: [e.exchange],
					totalVolume: e.volume
				}
			}
		})
	});

	return consolidatedTickers;
}

format.trades = function(trades, exchange, pair) {
	var formattedTrades = []; //how to handle multiple exchanges?

	if (!trades || !trades.length) return formattedTrades;

	switch (exchange) {
		case 'bittrex':
			console.log(trades);
			trades.map((trade, i) => {
				formattedTrades[i] = {
					"pair": trade.Exchange,
					"exchange": "bittrex",
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
			trades.forEach((trade) => {
				if (trade.category == "exchange") {
					var formattedTrade = {
						"pair": pair,
						"exchange": "poloniex",
						"date": new Date(trade.date),
						"type": trade.type,
						"amount": parseFloat(trade.amount),
						"remainingAmount": parseFloat(trade.remainingAmount),
						"rate": parseFloat(trade.rate),
						"fee": parseFloat(trade.fee)
					};
					formattedTrades.push(formattedTrade);
				}
			})
			break;
	}

	return formattedTrades;
}

module.exports = format;