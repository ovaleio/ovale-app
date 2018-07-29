import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const newOrderReducer = handleActions({
  [actions.initNewOrder](state) {
    return {
      ...state,
      amount: 0,
      price: 0
    }
  },
  [actions.setAmount](state, { payload: { amount } }) {
    return {
      ...state,
      amount: amount
    }
  },
  [actions.setPrice](state, { payload: { price} }) {
    return {
      ...state,
      price: price
    }
  }
}, initialState.newOrder);

export default newOrderReducer
