import { createAction, createActions } from 'redux-actions'

// export const {buy, sell} = createActions({
// 	BUY_LIMIT: () => ({type: 'buy'}),
// 	SELL_LIMIT: () => ({type: 'sell'})
// });
export const buy = createAction('BUY_LIMIT');
export const sell = createAction('SELL_LIMIT');
export const initNewOrder = createAction('INIT_NEW_ORDER');
export const setAmount = createAction('SET_AMOUNT');
export const setPrice = createAction('SET_PRICE');