import { handleActions } from 'redux-actions';
import { setSearchQuery, setSort, fetchTickers } from '../actions/tickers'
import initialState from './initialState';

const tickersReducer = handleActions({
  [setSearchQuery](state, { payload: { query } }) {
    return { 
      ...state, 
      searchQuery: query 
    }
  },
  [setSort](state, { payload: { sortKey, sortDirection } }) {
    return { 
      ...state, 
      sortKey: sortKey, 
      sortDirection: sortDirection 
    }
  },
  [fetchTickers](state, {payload: data}) {
    return { ...state, data: data}
  }
}, initialState.tickers);

export default tickersReducer