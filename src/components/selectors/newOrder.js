import { createSelector } from 'reselect'
import { currentTickerSelector } from './tickers'
import { currentTickerBalanceSelector } from './balances'

export const mapStateToProps = (state) => {
	const currentBalance = currentTickerBalanceSelector(state);
	const currentTicker = currentTickerSelector(state);
	return {
		...state.newOrderReducer,
		availableBalance: currentBalance ? currentBalance.balance : 0,
		currentPrice: currentTicker ? currentTicker.price : 0,
		tickerSymbol: currentTicker ? currentTicker.symbol : '',
		currencies: currentTicker ? currentTicker.currencies : ['', '']
	}
}