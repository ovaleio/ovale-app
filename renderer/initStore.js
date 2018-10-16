import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import initialState from './reducers/initialState'
import { emit } from './websocket.js'
import { routerMiddleware } from 'react-router-redux'
import history from './history';

const historyMiddleware = routerMiddleware(history)


const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;


export default function initStore () {
  const store = createStore(
  	rootReducer,
  	initialState,
    composeEnhancers(
  		applyMiddleware(
        historyMiddleware,
        thunkMiddleware.withExtraArgument({ emit }),
        logger
      )
  	)
  )

  return store;
}