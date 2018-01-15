import { handleActions } from 'redux-actions';
import { 
	setSearchQuery,
	setSort,
	fetchTrades
} from '../actions/trades'
import initialState from './initialState';

const tradesReducer = handleActions({
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
  [fetchTrades](state, {payload: data}) {
    return { ...state, data: data}
  }
}, initialState.trades);

export default tradesReducer