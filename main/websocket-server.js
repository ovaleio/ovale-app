const {clients, format} = require('cryptoclients'); //grab dev version if exists

const {ipcMain} = require('electron')
const settings = require('electron-settings')
const request = require('request');
const async = require('async');

const saveCredentials = (event, credentials) => {
    settings.set('credentials', credentials)
    settings.set('lastSaved', Date.now())
    event.sender.send('WEBSOCKET_SUCCESS', {message: 'Settings saved !'})

    //Restart websocket
    initSocket(event);
}

const initSocket = (event) => {

    const exchangeSockets = {
        'bitfinex': (lib) => {
            const ws = lib.ws();

            ws.on('open', () => {
                console.log("Bitfinex Websocket connected");
                updateStatus('bitfinex', true);
                lib.rest(2).symbols((err, symbols) => {
                    if (err) return;

                    symbols.forEach((symbol) => {
                        var betaSymbol = 't' + symbol.toUpperCase()
                        ws.subscribeTicker(betaSymbol)
                        ws.onTicker({symbol: betaSymbol}, (ticker) => handleTickerData.bitfinex(symbol, ticker));
                    })
                })
            })

            ws.on('error', console.error);
            ws.on('close', () => {
                console.log("Bitfinex Websocket disconnected");
                updateStatus("bitfinex", false);
            })

            ws.open()
        },
        'poloniex': (lib) => {
            lib.on('open', () => {
              updateStatus('poloniex', true);
              lib.subscribe('ticker');
              lib.on('message', handleTickerData.poloniex);
            })

            lib.on('error', (err) => {
              console.log(`Poloniex Websocket An error has occured`, err);
            });
            lib.on('close', (reason, details) => {
              updateStatus("poloniex", false, reason);
            });

            lib.openWebSocket({ version: 2 });
        },
        'bittrex': (lib) => {
            lib.websockets.client(function() {
                updateStatus('bittrex', true);

                lib.getmarketsummaries(function (res, err) {
                    if (err) console.log(err);

                    var symbols = res.result.map((e,i) => { 
                        updateTickers('bittrex', e.MarketName, e.Last)
                        return e.MarketName
                    })
                    lib.websockets.subscribe(symbols, handleTickerData.bittrex)
                });
            });
        }
    }

    const handleTickerData = {
        "bittrex": (data) => {
            if (data.M === 'updateExchangeState') {
              data.A.forEach(function(data_for) {
                //console.log('Market Update for '+ data_for.MarketName, data_for);
                if (data_for.Fills) {
                    updateTickers("bittrex", data_for.MarketName, data_for.Fills[0].Rate);
                }
              });
            }
        },
        "poloniex": (channelName, data, seq) => {
          if (channelName === 'ticker') {
            updateTickers("poloniex", data.currencyPair, data.last);
          }
        },
        "bitfinex": (symbol, ticker) => {
          updateTickers("bitfinex", symbol, ticker[6])
        }
    }

    const updateTickers = (exchange, pair, price) => {
        pair = format[exchange].from.pair(pair);
        var symbol = exchange + ':' + pair;
        socketState.channels.TICKERS.data[symbol] =  parseFloat(price); //write perf to check here
    }

    const updateStatus = (exchange, status) => {
        socketState.status[exchange] = status;
    }

    const sendTickers = (event) => {
        var cleanData = Object.keys(socketState.channels.TICKERS.data).map((symbol) => {
            var [exchange,pair] = symbol.split(':');
            return {symbol: symbol, price: socketState.channels.TICKERS.data[symbol], pair: pair, currencies: pair.split('-'), exchange: exchange}
        })
        console.log("TICKERS sent !")
        return event.sender.send('TICKERS', cleanData);
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
            console.log(err,res);
            
            if (err) {
                event.sender.send('WEBSOCKET_ERROR', {message: err && typeof err === 'Error' ? err.toString() : err}) 
            } else {
                event.sender.send('ADD_ORDERS', {orders});
                event.sender.send('WEBSOCKET_SUCCESS', {message: 'Order added !'})
            }
        })
    }

    //Catch orders & balances via rest api 
    const sendRestData = (event, channelName) => {
        event.sender.send('WEBSOCKET_PENDING', {message: 'Loading ' + channelName})

        console.log(channelName, ' rest data called');

        Clients.getAsync(channelName.toLowerCase(), (err, data) => {
            if (err) {
                console.log(err);
                return event.sender.send('WEBSOCKET_ERROR',  {message: err})
            }

            //flatten should be an option somewhere
            socketState.channels[channelName] = {
                data: format.flatten(data),
                lastSent: Date.now()
            }
            console.log(channelName + " sent !", socketState.status)
            return event.sender.send(channelName, socketState.channels[channelName].data);
        });
    }

    const credentials = settings.get('credentials');
    const Clients = new clients({credentials});

    const channels = ['ORDERS', 'TICKERS', 'BALANCES', 'TRADES'];

    let socketState = {
        status: Clients.exchanges.reduce((o, exchange) => {o[exchange] = false; return o; }, {}),
        channels: channels.reduce((o, channelName) => {o[channelName] = {data: {}, lastSent: 0}; return o;}, {})
    };
    console.log('Initialized Socket', socketState);

    if (event) event.sender.send('WEBSOCKET_PENDING', {message: 'Starting Websocket...'})


    //Listeners
    ipcMain.on('BUY_LIMIT', handleNewOrder)
    ipcMain.on('SELL_LIMIT', handleNewOrder)
    ipcMain.on('REQUEST_DATA', sendRestData)
    ipcMain.on('REQUEST_TICKERS', sendTickers)
    ipcMain.on('REQUEST_SETTINGS', sendSettings)
    ipcMain.on('CANCEL_ORDER', handleCancelOrder)

    Clients.exchanges.map((e,i) => exchangeSockets[e](Clients.libraries[i]));
}

ipcMain.on('SAVE_CREDENTIALS', saveCredentials)
ipcMain.on('INIT_SOCKET', initSocket)

module.exports = initSocket