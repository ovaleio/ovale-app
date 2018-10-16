const supportedExchanges = ['bitfinex', 'bittrex', 'poloniex', 'binance', 'kraken'];

const settings = {
    lastCheckUpdate:0,
	firstOpening: true,
	restDelay: {
			orders: 15000,
			balances: 60000,
			trades: 240000
	},
	supportedExchanges: supportedExchanges,
	credentials: supportedExchanges.reduce((o, exchange) => {o[exchange] = {"apikey": "", "apisecret": ""}; return o; }, {}),
	enableAnalytics: true
}

module.exports = settings;