import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const balancesReducer = handleActions({
  [actions.setSearchQueryBalances](state, { payload: { query } }) {
    return { 
      ...state, 
      searchQuery: query 
    }
  },
  [actions.setSortBalances](state, { payload: { sortKey } }) {
    return { 
      ...state, 
      sortKey: sortKey, 
      sortDirection: sortKey === state.sortKey ? state.sortDirection * -1 : state.sortDirection
    }
  },
  [actions.receiveBalances](state, {payload: data}) {
    return { ...state, data: data}
  }
}, initialState.balances);

export default balancesReducer