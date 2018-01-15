import { handleActions } from 'redux-actions';
import { setCurrentTicker } from '../actions/ticker'
import initialState from './initialState';

const tickerReducer = handleActions({
 [setCurrentTicker](state, { payload: { symbol } }) {
   return { ...state, currentTickerSymbol: symbol }
 }
}, initialState.ticker);

export default tickerReducer