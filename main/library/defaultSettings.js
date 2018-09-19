const supportedExchanges = ['bitfinex', 'bittrex', 'poloniex']

const settings = {
	restDelay: {
		orders: 15000,
		balances: 60000,
		trades: 240000
	},
	supportedExchanges: supportedExchanges,
	credentials: supportedExchanges.reduce((o, exchange) => {o[exchange] = {"apikey": "", "apisecret": ""}; return o; }, {})
}

module.exports = settings;