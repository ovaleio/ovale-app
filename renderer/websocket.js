import io from 'socket.io-client'
const socket = io('http://localhost:7070', {forceNew: true})

const messageTypes = ['ORDERS', 'TICKERS', 'TRADES', 'BALANCES', 'STATUS'];

const init = (store) => {
  // add listeners to socket messages so we can re-dispatch them as actions
  messageTypes.map(type => socket.on(type, (payload) => store.dispatch({ type, payload })))
}

const emit = (type, payload) => socket.emit(type, payload)

export {
  init,
  emit
}