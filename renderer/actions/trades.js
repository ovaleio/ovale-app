import { createAction } from 'redux-actions'

export const setSearchQuery = createAction('SET_SEARCH_QUERY_TRADES');
export const setSort = createAction('SET_SORT_TRADES');

export const fetchTrades = createAction('TRADES');