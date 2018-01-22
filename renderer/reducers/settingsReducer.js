import { handleActions} from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';
import settings from 'electron-settings'


const settingsReducer = handleActions({
  [actions.saveSettings](state) {
    console.log(state.credentials);
    settings.set('credentials', state.credentials)
    settings.set('lastSaved', Date.now())
    //display message it has been saved
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