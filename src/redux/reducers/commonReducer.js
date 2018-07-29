import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const commonReducer = handleActions({
 [actions.switchTab](state, { payload: { tab } }) {
   return { ...state, currentTab: tab }
 },
}, initialState.common);

export default commonReducer