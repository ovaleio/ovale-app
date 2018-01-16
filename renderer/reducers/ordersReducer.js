import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const ordersReducer = handleActions({
  [actions.setSearchQueryOrders](state, { payload: { query } }) {
    return { 
      ...state, 
      searchQuery: query 
    }
  },
  [actions.setSortOrders](state, { payload: { sortKey } }) {
    console.log(state);
    return { 
      ...state, 
      sortKey: sortKey, 
      sortDirection: sortKey === state.sortKey ? state.sortDirection * -1 : state.sortDirection
    }
  },
  [actions.receiveOrders](state, {payload: data}) {
    return {...state, data: data}
  },
  [actions.cancelAll](state) {
    var asyncData = [];
    return { 
    	...state, 
    	data: asyncData
    }
  }
}, initialState.orders);

export default ordersReducer