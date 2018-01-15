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
		data: [],
		sortKey: 'date',
		sortDirection: -1,
		searchQuery: ''
	},
	tickers: {
		data: [],
		sortKey: 'symbol',
		sortDirection: 1,
		searchQuery: 'ETH'
	},
	balances: {
		data: [],
		total: {'BTC': 0, 'USD': 0},
		sortKey: 'currency',
		sortDirection: 1,
		searchQuery: 'BTC'
	},
	trades: {
		data: [],
		sortKey: 'date',
		sortDirection: -1,
		searchQuery: ''
	}
}
