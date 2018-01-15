import { createAction } from 'redux-actions'

export const setSearchQuery = createAction('SET_SEARCH_QUERY_ORDERS');
export const setSort = createAction('SET_SORT_ORDERS');

export const fetchOrders = createAction('ORDERS');
export const cancelOrder = createAction('CANCEL_ORDER');
export const cancelAll = createAction('CANCEL_ALL');