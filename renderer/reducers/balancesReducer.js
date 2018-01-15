import { handleActions } from 'redux-actions';
import { 
	setSearchQuery,
	setSort,
	fetchBalances
} from '../actions/balances'
import initialState from './initialState';

const balancesReducer = handleActions({
  [setSearchQuery](state, { payload: { query } }) {
    return { 
      ...state, 
      searchQuery: query 
    }
  },
  [setSort](state, { payload: { sortKey } }) {
    console.log(state)
    return { 
      ...state, 
      sortKey: sortKey, 
      sortDirection: sortKey === state.sortKey ? state.sortDirection * -1 : state.sortDirection
    }
  },
  [fetchBalances](state, {payload: data}) {
    return { ...state, data: data}
  }
}, initialState.balances);

export default balancesReducer