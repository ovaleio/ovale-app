const {clients, format} = require('cryptoclients');
const settings = require('electron-settings')
const {ipcMain} = require('electron')
const handleSockets = require('./websocket-server');

//Catch orders & balances via rest api
const sendRestData = (event, channelName, clients) => {
    event.sender.send('WEBSOCKET_PENDING', {message: 'Loading ' + channelName})
    console.log(channelName, ' rest data called');

    clients.getAsync(channelName.toLowerCase(), (err, data) => {
        if (err) {
            console.log(err);
            return event.sender.send('WEBSOCKET_ERROR',  {message: err})
        }
		data = format.flatten(data)

        console.log(channelName + " sent !")
        return event.sender.send(channelName, data);
    });
}

const sendSettings = (event) => {
    return event.sender.send('SETTINGS', settings.getAll())
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
            const error = err.toString()
            console.log('c', error)
            event.sender.send('WEBSOCKET_ERROR', {message: error})
        } else {
            event.sender.send('ADD_ORDERS', {orders});
            event.sender.send('WEBSOCKET_SUCCESS', {message: 'Order added !'})
        }
    })
}

const saveCredentials = (event, credentials) => {
  global.credentials = credentials;
  settings.set('credentials', global.credentials)
  settings.set('lastSaved', Date.now())
  event.sender.send('WEBSOCKET_SUCCESS', {message: 'Settings saved !'})
  handleSockets.restart()
  handleRest();
}

const openedMainWindow = (event) => {
  if (!settings.has('init')) event.sender.send('OPEN_SNACKBAR_REDIRECT', {message: 'Welcome ! Please add credentials', redirectTo: '/settings'})
}

const handlers = {
	'BUY_LIMIT': handleNewOrder,
	'SELL_LIMIT': handleNewOrder,
	'REQUEST_DATA': sendRestData,
	'REQUEST_SETTINGS': sendSettings,
	'CANCEL_ORDER': handleCancelOrder,
	'SAVE_CREDENTIALS': saveCredentials,
	'OPENED_MAIN_WINDOW': openedMainWindow
}

const handleRest = () => {
	//Init Clients
	const Clients = new clients({credentials: global.credentials});

	//Remount listeners
	Object.keys(handlers).forEach((h) => {
		ipcMain.removeAllListeners(h)
		ipcMain.on(h, (event, data) => {
			handlers[h](event, data, Clients);
		});
	})
	return true;
}

module.exports = handleRest
