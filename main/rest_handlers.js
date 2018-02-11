const {clients, format} = require('cryptoclients');
const settings = require('electron-settings')
const {ipcMain} = require('electron')
const handleSockets = require('./websocket-server');


module.exports = (credentials) => {
	//Initalize Clients for REST endpoints
	const Clients = new clients({credentials});

	//Catch orders & balances via rest api 
	const sendRestData = (event, channelName) => {
	    event.sender.send('WEBSOCKET_PENDING', {message: 'Loading ' + channelName})
	    console.log(channelName, ' rest data called');

	    Clients.getAsync(channelName.toLowerCase(), (err, data) => {
	        if (err) {
	            console.log(err);
	            return event.sender.send('WEBSOCKET_ERROR',  {message: err})
	        }
	        console.log(data);

	        var data = format.flatten(data)

	        console.log(channelName + " sent !")
	        return event.sender.send(channelName, data);
	    });
	}

	const sendSettings = (event) => {
	    return event.sender.send('SETTINGS', settings.getAll())
	}

	const handleCancelOrder = (event, order) => {
	    event.sender.send('WEBSOCKET_PENDING', {message: 'Cancelling order...'})

	    Clients.get('cancelOrder', order.exchange)(order, (err, res) => {
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

	const handleNewOrder = (event, {orders}) => {
	    event.sender.send('WEBSOCKET_PENDING', {message: 'Passing order...'})

	    Clients.passOrders(orders, (err,res) => {
	        if (err) {
	            const error = err && typeof err === 'Error' ? err.toString() : (err.message || 'Erreur')
	            console.log('c', error)
	            event.sender.send('WEBSOCKET_ERROR', {message: error}) 
	        } else {
	            event.sender.send('ADD_ORDERS', {orders});
	            event.sender.send('WEBSOCKET_SUCCESS', {message: 'Order added !'})
	        }
	    })
	}

	const saveCredentials = (event, credentials) => {
	  settings.set('credentials', credentials)
	  settings.set('lastSaved', Date.now())
	  event.sender.send('WEBSOCKET_SUCCESS', {message: 'Settings saved !'})
	  handleSockets.restart(credentials, global.websockets)
	}

	const handlers = {
		'BUY_LIMIT': handleNewOrder,
		'SELL_LIMIT': handleNewOrder,
		'REQUEST_DATA': sendRestData,
		'REQUEST_SETTINGS': sendSettings,
		'CANCEL_ORDER': handleCancelOrder,
		'SAVE_CREDENTIALS': saveCredentials
	}

	Object.keys(handlers).map((h) => {
		ipcMain.on(h, handlers[h])
	})
}