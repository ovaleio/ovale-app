import { handleActions } from 'redux-actions';
import { 
	setSearchQuery,
	setSort,
	fetchOrders,
	cancelOrder,
	cancelAll
} from '../actions/orders'
import initialState from './initialState';

const ordersReducer = handleActions({
  [setSearchQuery](state, { payload: { query } }) {
    return { 
      ...state, 
      searchQuery: query 
    }
  },
  [setSort](state, { payload: { sortKey } }) {
    console.log(state);
    return { 
      ...state, 
      sortKey: sortKey, 
      sortDirection: sortKey === state.sortKey ? state.sortDirection * -1 : state.sortDirection
    }
  },
  [fetchOrders](state, {payload: data}) {
    return {...state, data: data}
  },
  [cancelOrder](state, {payload: { orderId } }) {
    var asyncData = [];
    return { 
    	...state, 
    	data: asyncData
    }
  },
  [cancelAll](state) {
    var asyncData = [];
    return { 
    	...state, 
    	data: asyncData
    }
  }
}, initialState.orders);

export default ordersReducer