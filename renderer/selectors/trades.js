import { createSelector } from 'reselect'

export const searchQuerySelector = state => state.tradesReducer.searchQuery
export const tradesSelector = state => state.tradesReducer.data
export const sortKeySelector = state => state.tradesReducer.sortKey
export const sortDirectionSelector = state => state.tradesReducer.sortDirection

export const filterSearchSelector = createSelector(
  tradesSelector,
  searchQuerySelector,
  (items, searchQuery) => items.filter((t) => t.symbol.match(new RegExp(searchQuery, 'i')))
)

export const tradesSortedSelector = createSelector(
	filterSearchSelector,
	sortKeySelector,
	sortDirectionSelector,
	(items, sortKey, sortDirection) => items.sort((a,b) => {
    return (a[sortKey] > b[sortKey]) ? sortDirection : ((b[sortKey] > a[sortKey]) ? -1 * sortDirection : 0)
  })
)

export const mapStateToProps = (state) => {
  return {
    trades: tradesSortedSelector(state),
    delay: state.settingsReducer.restDelay.trades
  }
}