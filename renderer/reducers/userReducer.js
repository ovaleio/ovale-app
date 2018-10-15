import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';


// The reducer allows to re-ceive the results of actions and set the new state.

const userReducer = handleActions({

  // Used to define
  [actions.USER_LOGGED_IN](state) {
    return { ...state }
  },
  // action login
  [actions.login](state) {
    return { ...state }
  }
}, initialState.user);

export default userReducer