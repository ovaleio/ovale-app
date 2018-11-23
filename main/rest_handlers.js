const {clients, format} = require('./library/cryptoclients');
const {ipcMain} = require('electron');

const Credentials = require('./library/user-settings/credentials');
const WebsockerHandler = require('./websocket-server');


//Catch orders & balances via rest api 
const sendRestData = (event, channelName, clients) => {
  event.sender.send('WEBSOCKET_PENDING', {message: 'Loading ' + channelName});

  clients.getAsync(channelName.toLowerCase(), (err, data) => {

    if (err) {
      console.log(err);
      return event.sender.send('WEBSOCKET_ERROR',  {message: err})
    }
    data = format.flatten(data)


    return event.sender.send(channelName, data);
  });
}

const handleCancelOrder = (event, order, clients) => {
  event.sender.send('WEBSOCKET_PENDING', {message: 'Cancelling order...'})

  clients.get('cancelOrder', order.exchange)(order, (err, res) => {
    console.log(err,res);
    if (err) {
      event.sender.send('WEBSOCKET_ERROR', {message: 'Could not cancel order' })
    }
    else {
      //NEED TO CREATE CANCEL_ORDER_SUCCESS to remove order from client
      event.sender.send('REMOVE_ORDER', {order_id: order.id})
      event.sender.send('WEBSOCKET_SUCCESS', {message: 'Order cancelled !'})
    }
  })
}

const handleNewOrder = (event, {orders}, clients) => {
  event.sender.send('WEBSOCKET_PENDING', {message: 'Passing order...'})

  clients.passOrders(orders, (err,res) => {
    if (err) {
      const error = err && typeof err === 'Error' ? err.toString() : (err.message || 'Erreur')
      console.log('Error Passing Order', error)
      event.sender.send('WEBSOCKET_ERROR', {message: error})
    } else {
      event.sender.send('ADD_ORDERS', {orders});
      event.sender.send('WEBSOCKET_SUCCESS', {message: 'Order added !'})
    }
  })
}


const handlers = {
  'BUY_LIMIT': handleNewOrder,
  'SELL_LIMIT': handleNewOrder,
  'REQUEST_DATA': sendRestData,
  'CANCEL_ORDER': handleCancelOrder,
}

const RestHandler = (password, callback) => {
  
  global.password = password || global.password;

  //We launch a new object for accessing the credentials
  CredentialsHandler = new Credentials(global.password);

  // We get and send the credentiuals to implement a new client
  // we make it accessible to global
  CredentialsHandler.get().then(credentials => {

    global.credentials = credentials

    //Init Clients
    global.clients = new clients({credentials: global.credentials});
    
    // Init Websocket Handler
    global.websockets = WebsockerHandler.init();

    //Remount listeners
    Object.keys(handlers).map((h) => {
      ipcMain.removeAllListeners(h)
      ipcMain.on(h, (event, data) => {
        handlers[h](event, data, global.clients);
      });
    })
    callback(global.credentials);
  }).catch(e=> {
    console.error(e)
  });
  
}

module.exports = RestHandler