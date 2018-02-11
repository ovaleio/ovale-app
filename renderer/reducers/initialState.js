const supportedExchanges = ['bitfinex', 'bittrex', 'poloniex']

module.exports = {
	common: {
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
		ticker: '',
		type: 'limit',
		amount: 0,
		price: 0
	},
	orders: {
		data: [],
		sortKey: 'date',
		sortDirection: -1,
		searchQuery: ''
	},
	tickers: {
		data: [],
		sortKey: 'symbol',
		sortDirection: 1,
		searchQuery: ''
	},
	balances: {
		data: [],
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
	},
	messageBar: {
		showSnackbar: false,
		message: '',
		messageType: '',
		style: {}
	},
	settings: {
		restDelay: {
			orders: 15000,
			balances: 60000,
			trades: 240000
		},
		supportedExchanges: supportedExchanges,
    	credentials: supportedExchanges.reduce((o, exchange) => {o[exchange] = {"apikey": "", "apisecret": ""}; return o; }, {})
	}
}
