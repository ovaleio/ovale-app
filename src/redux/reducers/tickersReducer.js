import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const tickersReducer = handleActions({
  [actions.setSearchQueryTickers](state, { payload: { query } }) {
    return { 
      ...state, 
      searchQuery: query 
    }
  },
  [actions.setSortTickers](state, { payload: { sortKey, sortDirection } }) {
    return { 
      ...state, 
      sortKey: sortKey, 
      sortDirection: sortDirection 
    }
  },
  [actions.receiveTickers](state, {payload: data}) {
    return { ...state, data: data}
  },
}, initialState.tickers);

export default tickersReducer