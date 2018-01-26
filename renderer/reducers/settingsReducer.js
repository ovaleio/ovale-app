import { handleActions} from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';
import settings from 'electron-settings'


const settingsReducer = handleActions({
  [actions.saveSettings](state) {
    settings.set('credentials', state.credentials)
    settings.set('lastSaved', Date.now())
    return state;
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