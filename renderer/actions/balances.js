import { createAction } from 'redux-actions'

export const setSearchQuery = createAction('SET_SEARCH_QUERY_BALANCES');
export const setSort = createAction('SET_SORT_BALANCES');

export const fetchBalances = createAction('BALANCES');