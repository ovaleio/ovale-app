import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const tradesReducer = handleActions({
  [actions.setSearchQueryTrades](state, { payload: { query } }) {
    return { 
      ...state, 
      searchQuery: query 
    }
  },
  [actions.setSortTrades](state, { payload: { sortKey, sortDirection } }) {
    return { 
      ...state, 
      sortKey: sortKey, 
      sortDirection: sortDirection 
    }
  },
  [actions.receiveTrades](state, {payload: data}) {
    return { ...state, data: data}
  }
}, initialState.trades);

export default tradesReducer