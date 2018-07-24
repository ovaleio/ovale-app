import { createSelector } from 'reselect'
import { tickersSelector } from './tickers'
import { baseCurrencySelector } from './common'

const getPrice = (obj, tickers) => {
  var ticker = tickers.find((t) => t.symbol === obj.symbol);
  return ticker ? ticker.price : 0;
}

export const searchQuerySelector = state => state.ordersReducer.searchQuery
export const ordersSelector = state => state.ordersReducer.data
export const sortKeySelector = state => state.ordersReducer.sortKey
export const sortDirectionSelector = state => state.ordersReducer.sortDirection

export const filterSearchSelector = createSelector(
  ordersSelector,
  searchQuerySelector,
  (items, searchQuery) => items.filter((o) => o.symbol.match(new RegExp(searchQuery, 'i')))
)

export const cleanOrdersSelector = createSelector(
  filterSearchSelector,
  tickersSelector,
  baseCurrencySelector,
  (items, tickers, baseCurrency) => items.map((o) => {
    const price = getPrice(o, tickers, baseCurrency)
    return {...o, price: price, totalValue: price * o.amount, deltaPercent: 1 - (price / o.rate)}
  })
)

export const ordersSortedSelector = createSelector(
	cleanOrdersSelector,
	sortKeySelector,
	sortDirectionSelector,
	(items, sortKey, sortDirection) => items.sort((a,b) => {
    return (a[sortKey] > b[sortKey]) ? sortDirection : ((b[sortKey] > a[sortKey]) ? -1 * sortDirection : 0)
  })
)

export const totalSelector = createSelector(
  cleanOrdersSelector,
  items => items.length ? items.map( b => b.totalValue ).reduce((acc, cur) => acc + cur) : []
)

export const mapStateToProps = (state) => {
  return {
    baseCurrency: baseCurrencySelector(state),
    orders: ordersSortedSelector(state),
    total: totalSelector(state),
    delay: state.settingsReducer.restDelay.orders || 0
  }
}