import { createAction } from 'redux-actions'

//COMMON
export const switchTab = createAction('SWITCH_TAB');
export const closeSnackbar = createAction('CLOSE_SNACKBAR');
export const resetData = createAction('RESET_DATA')

//WEBSOCKET HANDLERS
export const webSocketError = createAction('WEBSOCKET_ERROR');
export const webSocketSuccess = createAction('WEBSOCKET_SUCCESS');
export const webSocketPending = createAction('WEBSOCKET_PENDING');
export const initSocket = () => {
	return (dispatch, getState, {emit}) => {
		emit('INIT_SOCKET')
	}
};

//SNACKBAR
export const openSnackbarError = createAction('OPEN_SNACKBAR_ERROR');
export const openSnackbarSuccess = createAction('OPEN_SNACKBAR_SUCCESS');
export const openSnackbarRedirect = createAction('OPEN_SNACKBAR_REDIRECT');

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
		emit('REQUEST_DATA', 'ORDERS')
	}
};
export const cancelOrder = ({order}) => {
	return (dispatch, getState, {emit}) => {
		emit('CANCEL_ORDER', order)
	}
}
export const cancelAllOrders = createAction('CANCEL_ALL_ORDERS');
export const addOrders = createAction('ADD_ORDERS')
export const removeOrder = createAction('REMOVE_ORDER')

//TRADES
export const setSearchQueryTrades = createAction('SET_SEARCH_QUERY_TRADES');
export const setSortTrades = createAction('SET_SORT_TRADES');
export const receiveTrades = createAction('TRADES');
export const requestTrades = () => {
	return (dispatch, getState, {emit}) => {
		emit('REQUEST_DATA', 'TRADES')
	}
};

//BALANCES
export const setSearchQueryBalances = createAction('SET_SEARCH_QUERY_BALANCES');
export const setSortBalances = createAction('SET_SORT_BALANCES');
export const receiveBalances = createAction('BALANCES');
export const requestBalances = () => {
	return (dispatch, getState, {emit}) => {
		emit('REQUEST_DATA', 'BALANCES')
	}
};

//SETTINGS
export const saveSettings = createAction('SAVE_SETTINGS');
export const handleChangeSettings = createAction('HANDLE_CHANGE_SETTINGS');
export const receiveSettings = createAction('SETTINGS');
export const requestSettings = () => {
	return (dispatch, getState, {emit}) => {
		emit('REQUEST_SETTINGS')
	}
};