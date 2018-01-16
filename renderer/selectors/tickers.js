import { createSelector } from 'reselect'
import { currentTickerSymbolSelector } from './ticker'

export const searchQuerySelector = state => state.tickersReducer.searchQuery
export const tickersSelector = state => state.tickersReducer.data
export const sortKeySelector = state => state.tickersReducer.sortKey
export const sortDirectionSelector = state => state.tickersReducer.sortDirection

export const currentTickerSelector = createSelector(
	tickersSelector,
	currentTickerSymbolSelector,
	(tickers, currentTickerSymbol) => tickers.find((t) => t.symbol === currentTickerSymbol)
)

export const filteredTickersSelector = createSelector(
  tickersSelector,
  searchQuerySelector,
  (items, searchQuery) => items.filter((t) => t.symbol.match(new RegExp(searchQuery, 'i')))
)

export const sortTickersSelector = createSelector(
	filteredTickersSelector,
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
  	tickers: sortTickersSelector(state)
  }
}