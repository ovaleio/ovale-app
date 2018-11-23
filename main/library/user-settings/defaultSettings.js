
const settings = {
	user:{
		email:null,
		jwt:null,
		validUntil:null
	},
    lastCheckUpdate:0,
	firstOpening: true,
	restDelay: {
			orders: 15000,
			balances: 60000,
			trades: 240000
	},
	supportedExchanges: ['bitfinex', 'bittrex', 'poloniex', 'binance', 'kraken']

}

module.exports = settings;