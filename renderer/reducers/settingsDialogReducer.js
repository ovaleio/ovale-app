import { handleActions} from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const settingsDialogReducer = handleActions({
  [actions.openSettingsDialog](state) {
    console.log(state);
    return {
      ...state,
      open: true
    }
  },
  [actions.closeSettingsDialog](state) {
    return { 
      ...state, 
      open: false
    }
  }
}, initialState.settingsDialog);

export default settingsDialogReducer