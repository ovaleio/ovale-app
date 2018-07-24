import { createSelector } from 'reselect'
import { currentTickerSymbolSelector } from './ticker'
import { tickersSelector } from './tickers'
import { baseCurrencySelector } from './common'

const getPrice = (obj, tickers, baseCurrency) => {
  if (obj.currency === baseCurrency) return 1;
  const symbol = `${obj.exchange}:${baseCurrency}-${obj.currency}`
  const inverseSymbol = `${obj.exchange}:${obj.currency}-${baseCurrency}`
  var ticker = tickers.find((t) => t.symbol === symbol);
  var tickerInverse = tickers.find((t) => t.symbol === inverseSymbol)
  var price = ticker ? ticker.price : tickerInverse ? 1 / tickerInverse.price : 0;
  return price;
}

export const searchQuerySelector = state => state.balancesReducer.searchQuery
export const balancesSelector = state => state.balancesReducer.data
export const sortKeySelector = state => state.balancesReducer.sortKey
export const sortDirectionSelector = state => state.balancesReducer.sortDirection

export const currentTickerBalanceSelector = createSelector(
	balancesSelector,
	currentTickerSymbolSelector,
	(items, symbol) => items.find((b) => b.symbol === symbol)
)

export const filterSearchSelector = createSelector(
  balancesSelector,
  searchQuerySelector,
  (items, searchQuery) => items.filter((b) => b.symbol.match(new RegExp(searchQuery, 'i')))
)

export const balancesWithPriceSelector = createSelector(
  filterSearchSelector,
  tickersSelector,
  baseCurrencySelector,
  (items, tickers, baseCurrency) => items.map((b) => {
    const price = getPrice(b, tickers, baseCurrency)
    return {...b, price: price, totalValue: price * b.balance}
  })
)

export const totalSelector = createSelector(
  balancesWithPriceSelector,
  items => items.length ? items.map( b => b.totalValue ).reduce((acc, cur) => acc + cur) : 0
)

export const balancesWithShareSelector = createSelector(
  balancesWithPriceSelector,
  totalSelector,
  (items, total) => items.map((b) => ({...b, share: b.totalValue / total}))
)

export const balancesSortedSelector = createSelector(
	balancesWithShareSelector,
	sortKeySelector,
	sortDirectionSelector,
	(items, sortKey, sortDirection) => {
		return items.sort((a,b) => {
	      return (a[sortKey] > b[sortKey]) ? sortDirection : ((b[sortKey] > a[sortKey]) ? -1 * sortDirection : 0)
	    }).slice()
	}
)

export const mapStateToProps = (state) => {
  return {
    baseCurrency: baseCurrencySelector(state),
    balances: balancesSortedSelector(state),
    total: totalSelector(state),
    delay: state.settingsReducer.restDelay.balances
  }
}