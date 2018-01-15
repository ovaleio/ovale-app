import { createAction } from 'redux-actions'

export const setSearchQuery = createAction('SET_SEARCH_QUERY_TICKERS');
export const setSort = createAction('SET_SORT_TICKERS');
export const fetchTickers = createAction('TICKERS');