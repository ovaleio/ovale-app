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
    return {
      ...state,
      ...settings
    }
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
}, initialState.settings);

export default settingsReducer