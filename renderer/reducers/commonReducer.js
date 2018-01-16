import { handleActions } from 'redux-actions';
import * as actions from '../actions/actions'
import initialState from './initialState';

const commonReducer = handleActions({
 [actions.switchTab](state, { payload: { tab } }) {
   return { ...state, currentTab: tab }
 },
 [actions.closeSnackbar](state) {
    return { ...state, showSnackbar: false, message: ''}
 },
 [actions.webSocketError](state, { payload: { message } }) {
   return { ...state, message: message, showSnackbar: true}
 },
 [actions.webSocketSuccess](state, { payload: { message } }) {
   return { ...state, message: message, showSnackbar: true}
 },
 [actions.webSocketPending](state, { payload: { message } }) {
   return { ...state, message: message, showSnackbar: true}
 }
}, initialState.common);

export default commonReducer