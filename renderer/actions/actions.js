import { createAction } from 'redux-actions'

//COMMON
export const switchTab = createAction('SWITCH_TAB');
export const closeSnackbar = createAction('CLOSE_SNACKBAR');

//WEBSOCKET HANDLERS
export const webSocketError = createAction('WEBSOCKET_ERROR');
export const webSocketSuccess = createAction('WEBSOCKET_SUCCESS');
export const webSocketPending = createAction('WEBSOCKET_PENDING');

//TICKER
export const setCurrentTicker = createAction('SET_CURRENT_TICKER');

//TICKERS
export const setSearchQueryTickers = createAction('SET_SEARCH_QUERY_TICKERS');
export const setSortTickers = createAction('SET_SORT_TICKERS');
export const receiveTickers = createAction('TICKERS');
export const requestTickers = () => {
	return (dispatch, getState, {emit}) => {
		emit('REQUEST_TICKERS')
	}
};

//NEW_ORDER
export const buy = (symbol, amount, price) => {
	return (dispatch, getState, {emit}) => {
      const payload = {"orders": [{symbol: symbol, type: 'buy', amount: amount, rate: price}]}
      emit('BUY_LIMIT', payload)
    }
}
export const sell = (symbol, amount, price) => {
	return (dispatch, getState, {emit}) => {
      const payload = {"orders": [{symbol: symbol, type: 'sell', amount: amount, rate: price}]}
      emit('SELL_LIMIT', payload)
    }
}

export const initNewOrder = createAction('INIT_NEW_ORDER');
export const setAmount = createAction('SET_AMOUNT');
export const setPrice = createAction('SET_PRICE');

//ORDERS
export const setSearchQueryOrders = createAction('SET_SEARCH_QUERY_ORDERS');
export const setSortOrders = createAction('SET_SORT_ORDERS');
export const receiveOrders = createAction('ORDERS');
export const requestOrders = () => {
	return (dispatch, getState, {emit}) => {
		emit('REQUEST_ORDERS')
	}
};
export const cancelOrder = ({order}) => {
	return (dispatch, getState, {emit}) => {
		emit('CANCEL_ORDER', order)
	}
}
export const cancelAllOrders = createAction('CANCEL_ALL_ORDERS');

//TRADES
export const setSearchQueryTrades = createAction('SET_SEARCH_QUERY_TRADES');
export const setSortTrades = createAction('SET_SORT_TRADES');
export const receiveTrades = createAction('TRADES');
export const requestTrades = () => {
	return (dispatch, getState, {emit}) => {
		emit('REQUEST_TRADES')
	}
};

//BALANCES
export const setSearchQuery = createAction('SET_SEARCH_QUERY_BALANCES');
export const setSort = createAction('SET_SORT_BALANCES');
export const receiveBalances = createAction('BALANCES');
export const requestBalances = () => {
	return (dispatch, getState, {emit}) => {
		emit('REQUEST_BALANCES')
	}
};

//SETTINGS DIALOG
export const openSettingsDialog = createAction('OPEN_SETTINGS_DIALOG');
export const closeSettingsDialog = createAction('CLOSE_SETTINGS_DIALOG');