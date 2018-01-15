import { handleActions, combineActions } from 'redux-actions';
import { 
  buy,
  sell,
  initNewOrder,
  setAmount,
  setPrice
} from '../actions/newOrder'
import initialState from './initialState';

const newOrderReducer = handleActions({
  [combineActions(buy, sell)](state) {
    //async stuff
    var asyncData = []
    //DISPATCH SOME MESSAGE && REINITIALIZE FORM
    return state;
  },
  [initNewOrder](state) {
    return {
      ...state,
      amount: 0,
      price: 0
    }
  },
  [setAmount](state, { payload: { amount } }) {
    console.log(state)
    return { 
      ...state, 
      amount: amount 
    }
  },
  [setPrice](state, { payload: { price} }) {
    console.log(state)
    return { 
      ...state, 
      price: price
    }
  }
}, initialState.newOrder);

export default newOrderReducer