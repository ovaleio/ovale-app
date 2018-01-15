import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import initialState from './reducers/initialState'
import { init as websocketInit, emit } from './websocket.js'

export default function initStore () {
  const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware.withExtraArgument({ emit }))))
  websocketInit(store);
  return store;
}