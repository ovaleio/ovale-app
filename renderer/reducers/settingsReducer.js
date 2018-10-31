import { handleActions} from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';
import { ipcRenderer } from 'electron'


const settingsReducer = handleActions({
  [actions.saveSettings](state) {
    ipcRenderer.send('SAVE_CREDENTIALS', state.credentials)
    return state;
  },
  [actions.receiveSettings](state, {payload: settings}) {
    return settings;
  },
  [actions.handleChangeSettings](state, {payload: {target, exchange}}) {
  	return {
  		...state,
  		credentials: {
  			...state.credentials, 
  			[exchange]: {
  				...state.credentials[exchange],
  				[target.name]: target.value 
  			}
  		}
  	}
  },
  [actions.updateEmail](state, {payload: email}) {
    return  {
      ...state,
      user:{
        ...user,
        email:email
      } 
    };
  },

  /*
  USER : When the onboardin is loaded, we get the user from electron-settings via ipcrenderer
  */
 [actions.receiveUser](state, {payload: user}) {
    return { 
      ...state, 
      user
    }
  },
   /*
  First Screen
  */
 [actions.onboardingFirstStep](state) {
  return { 
      ...state,
      user:{
        email:'',
        jwt:''
      }
    }
  },

}, initialState.settings);

export default settingsReducer