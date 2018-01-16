import io from 'socket.io-client'
const socket = io('http://localhost:7070', {forceNew: true})

const messageTypes = ['ORDERS', 'TICKERS', 'TRADES', 'BALANCES', 'STATUS', 'WEBSOCKET_SUCCESS', 'WEBSOCKET_ERROR', 'WEBSOCKET_PENDING'];
const requestTypes = ['REQUEST_ORDERS', 'REQUEST_TICKERS', 'REQUEST_BALANCES', 'REQUEST_TRADES']

const emit = (type, payload) => socket.emit(type, payload)

const init = (store) => {
  // add listeners to socket messages so we can re-dispatch them as actions
  messageTypes.map(type => socket.on(type, (payload) => store.dispatch({ type, payload })))

  //maybe not the best place ?
  requestTypes.map(type => emit(type))
}


export {
  init,
  emit
}