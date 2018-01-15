import { combineReducers } from 'redux';
import commonReducer from './commonReducer'
import tickerReducer from './tickerReducer'
import newOrderReducer from './newOrderReducer'
import tickersReducer from './tickersReducer'
import ordersReducer from './ordersReducer'
import tradesReducer from './tradesReducer'
import balancesReducer from './balancesReducer'

const rootReducer = combineReducers({
  commonReducer,
  tickerReducer,
  newOrderReducer,
  tickersReducer,
  ordersReducer,
  tradesReducer,
  balancesReducer
})

export default rootReducer;