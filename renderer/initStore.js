import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import initialState from './reducers/initialState'
import { init as websocketInit, emit } from './websocket.js'
import { routerMiddleware } from 'react-router-redux'
import history from './history';

const historyMiddleware = routerMiddleware(history)

export default function initStore () {
  const store = createStore(
  	rootReducer,
  	initialState,
  	composeWithDevTools(
  		applyMiddleware(historyMiddleware, thunkMiddleware.withExtraArgument({ emit }))
  	)
  )

  websocketInit(store);
  return store;
}