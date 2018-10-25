import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

// The reducer allows to re-ceive the results of actions and set the new state.

const userReducer = handleActions({
 
  /*
  Email Success : When a user email is successfully authentified by the api
  */
 [actions.emailSuccess](state, {payload: email}) {
  return { 
    ...state, 
    user: {
      email
    },
    step:10
  }
},

 
/*
  Login Success : When a user is successfully authentified by the api
  */
 [actions.loginSuccess](state, {payload: res}) {
   console.log("action login success", res.jwt)
  return { 
    ...state,
    user: {
      ...state.user,
      email: res.email,
      jwt: res.jwt
    },
    
    step:666
  }
},
 
  /*
  Email Error : When a user encouters an unexpected result
  */
  [actions.apiUnreachable](state,{} ) {
    console.log('nok')
    return { 
      ...state,
      message: 'Api unreachable'
    }
  },

  /*
  Email NOT FOUND : When a user is not authentified by the api (not yet registered)
  */
 [actions.emailNotFound](state, {payload: email}) {
  return { 
    ...state,
    user: {
      email
    },
    step:2,
    message: ""
  }
},

  /*
  set Message
  */
  [actions.emailSetMessage](state,{payload: message}) {
    return { 
      ...state,
      message: message
    }
  },

  /*
  Digits SUCCESS : When a user has successfully entered the 6 digits
  */
  [actions.digitsSuccess](state,{payload:jwt}) {
    return { 
      ...state,
      jwt: jwt.result,
      step:3,
      message: ""
    }
  },

  /*
  When a user successfully creeated an account
  */
 [actions.registerSuccess](state) {
  return { 
      ...state,
      step:4,
      message: ""
    }
  },

  /*
  userName : When a user edits his name
  */
 [actions.userName](state, {payload: name}) {
  return { 
      ...state,
      user: {...state.user, name},
      step:666,
      message: ""
    }
  },


  /*
  Down step
  */
 [actions.onboardingStepDown](state) {
  return { 
      ...state,
      step:state.step--,
      message: ""
    }
  },

}, initialState.user);

export default userReducer