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
  }
}, initialState.settings);

export default settingsReducer