import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

// The reducer allows to re-ceive the results of actions and set the new state.

const userReducer = handleActions({
 
  // email Login
  [actions.emailSuccess](state, {payload: email}) {
    console.log('ok')
    return { 
      ...state, 
      exists:true,
      email: email
    }
  },
  // email Login
  [actions.emailError](state) {
    console.log('nok')
    return { 
      ...state,
      exists:false,
      email:""
    }
  }
}, initialState.user);

export default userReducer