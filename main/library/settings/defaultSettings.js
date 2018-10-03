const supportedExchanges = ['bitfinex', 'bittrex', 'poloniex', 'binance'];

const settings = {
    lastCheckUpdate:0,
		firstOpening: true,
		restDelay: {
				orders: 15000,
				balances: 60000,
				trades: 240000
		},
		supportedExchanges: supportedExchanges,
		credentials: supportedExchanges.reduce((o, exchange) => {o[exchange] = {"apikey": "", "apisecret": ""}; return o; }, {})
}

module.exports = settings;