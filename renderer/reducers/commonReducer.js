import { handleActions } from 'redux-actions';
import { switchTab, connectSocket } from '../actions/common'
import initialState from './initialState';

const commonReducer = handleActions({
 [switchTab](state, { payload: { tab } }) {
   return { ...state, currentTab: tab }
 },
 [connectSocket](state, { payload: { socket } }) {
   return { ...state, socket: socket}
 }
}, initialState.common);

export default commonReducer