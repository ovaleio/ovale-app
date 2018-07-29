export default {
	common: {
		showSnackbar: false,
		message: '',
		baseCurrency: 'BTC',
		currentTab: 'Orders',
		status: {}
	},
	ticker: {
		currentTickerSymbol: 'bitfinex:USD-BTC',
		price: 0,
		variation: 0
	},
	newOrder: {
		type: 'limit',
		amount: 0,
		price: 0
	},
	orders: {
		data: [{
			"pair" : "BTC-LTC",
			"type" : "sell",
			"exchange" : "bitfinex",
			"amount" : 5,
			"remainingAmount" : 5,
			"rate" : 0.12,
			"date" : "2017-12-21T22:06:02.000Z",
			"id" : "142940203887",
			"symbol" : "bitfinex:BTC-LTC"
		}],
		sortKey: 'date',
		sortDirection: -1,
		searchQuery: ''
	},
	tickers: {
		data: [{"symbol": "bitfinex:USD-BTC", price : 13722}, {"symbol": "bitfinex:BTC-LTC", price: 0.10}, {"symbol": "bitfinex:USD-LTC", price: 300}],
		sortKey: 'symbol',
		sortDirection: 1,
		searchQuery: ''
	},
	balances: {
		data: [{
			"ticker" : "bitfinex:BTC-BTC",
			"currency" : "BTC",
			"exchange" : "bitfinex",
			"balance" : 1396.85,
			"available" : 1396.85,
			"pending" : "",
			"symbol" : "bitfinex:BTC-BTC"
		}, {
			"ticker" : "bitfinex:BTC-LTC",
			"currency" : "LTC",
			"exchange" : "bitfinex",
			"balance" : 10,
			"available" : 10,
			"pending" : "",
			"symbol" : "bitfinex:BTC-LTC"
		}, {
			"ticker" : "bitfinex:USD-BTC",
			"currency" : "USD",
			"exchange" : "bitfinex",
			"balance" : 30,
			"available" : 10,
			"pending" : "",
			"symbol" : "bitfinex:USD-BTC"
		}],
		total: {'BTC': 0, 'USD': 0},
		sortKey: 'currency',
		sortDirection: 1,
		searchQuery: ''
	},
	trades: {
		data: [],
		sortKey: 'date',
		sortDirection: -1,
		searchQuery: ''
	}
}
