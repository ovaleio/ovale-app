const {clients, format} = require('cryptoclients'); //grab dev version if exists
const settings = require('electron-settings');
const credentials = settings.get('credentials');
const {libraries, exchanges, getRestData, cancelOrder, passOrders} = clients(credentials);

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

module.exports = () => {
    http.listen(7070, function(){
      console.log('listening on *:7070');
    });

    const request = require('request');
    const async = require('async');

    const channels = ['ORDERS', 'TICKERS', 'BALANCES', 'TRADES'];
    const delays = {TICKERS: 10000, ORDERS: 30010, BALANCES: 61020, TRADES: 100314};

    let socketState = {
        status: exchanges.reduce((o, exchange) => (Object.assign(o, {[exchange]: false})), {}),
        channels: channels.reduce((o, channelName) => (Object.assign(o, {[channelName]: {data: {}, lastSent: 0}})), {})
    };


    const handleSocketsOpen = {
        'poloniex': () => {
            libraries['poloniex'].openWebSocket({ version: 2 });

            libraries['poloniex'].on('open', () => {
              console.log(`Poloniex WebSocket Connected`);
              subscribeTickers.poloniex();
              updateStatus('poloniex', true);
            })
        },
        'bitfinex': () => {
            libraries['bitfinex'].ws.on('open', () => {
                console.log("Bitfinex Websocket connected");
                subscribeTickers.bitfinex();
                updateStatus('bitfinex', true);
            })
        },
        'bittrex' : () => {
            libraries['bittrex'].websockets.client(function() {
                console.log('Bittrex Websocket connected');
                subscribeTickers.bittrex();
                updateStatus('bittrex', true);
            });
        }
    }

    const handleSocketsError = {
        'bitfinex': () => {
            libraries['bitfinex'].ws.on('error', console.error);
        },
        'poloniex': () => {
            libraries['poloniex'].on('error', (error) => {
              console.log(`Poloniex Websocket An error has occured`);
            });
        },
        'bittrex': () => {}
    }

    const handleSocketsClose = {
        'bitfinex': () => {
            libraries['bitfinex'].ws.on('close', () => {
                console.log("Bitfinex Websocket disconnected");
                updateStatus("bitfinex", false);
            })
        },
        'poloniex': () => {
            libraries['poloniex'].on('close', (reason, details) => {
              console.log(`Poloniex WebSocket Disconnected`, reason, details);
              updateStatus("poloniex", false);
            });
        },
        'bittrex': () => {}
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
        "bitfinex": (pair, data)  => {
          updateTickers("bitfinex", pair, data.lastPrice);
        },
        "poloniex": (channelName, data, seq) => {
          if (channelName === 'ticker') {
            updateTickers("poloniex", data.currencyPair, data.last);
          }
        }
    }


    const subscribeTickers = {
        'bitfinex': () => { 
            libraries['bitfinex'].ws.on('ticker', handleTickerData.bitfinex)

            request.get('https://api.bitfinex.com/v1/symbols', { json: true }, (err, res, body) => {
                if (err) console.log(err);

                if (body) {
                    setInterval( () => {
                        var pair = body.pop();
                        libraries['bitfinex'].ws.subscribeTicker(pair);
                    }, 500)
                }
            })
        },
        'bittrex': () => {
            libraries['bittrex'].getmarketsummaries(function (res, err) {
                if (err) console.log(err);

                var symbols = res.result.map((e,i) => { return e.MarketName})
                libraries['bittrex'].websockets.subscribe(symbols, handleTickerData.bittrex)
            });
        },
        'poloniex': () => { 
            libraries['poloniex'].subscribe('ticker');
            libraries['poloniex'].on('message', handleTickerData.poloniex)
        }
    }

    function updateTickers (exchange, pair, price) {

        //console.log(pair, price);

        pair = format[exchange].from.pair(pair);
        var symbol = exchange + ':' + pair;
        socketState.channels.TICKERS.data[symbol] =  parseFloat(price); //write perf to check here

        var now = Date.now();
        if (now > (socketState.channels.TICKERS.lastSent + delays.TICKERS)) {
          socketState.channels.TICKERS.lastSent = now;
          sendTickers();
        }

    }

    function sendTickers () {
        var cleanData = Object.keys(socketState.channels.TICKERS.data).map((symbol) => ({symbol: symbol, price: socketState.channels.TICKERS.data[symbol]}))
        console.log("TICKERS sent !")
        return io.emit('TICKERS', cleanData);
    }

    function updateStatus (exchange, status) {
        socketState.status[exchange] = status;
        return io.emit('STATUS', socketState.status);
    }

    //Catch orders & balances via rest api 
    function updateRestData (channelName) {
        //Check that channel has been asked for
        if (channels.indexOf(channelName) !== -1) {
            //RETURN A PENDING MESSAGE
            io.emit('WEBSOCKET_PENDING', {message: 'Loading ' + channelName})

            console.log(channelName, ' rest data called');

            getRestData[channelName.toLowerCase()]((err, data) => {
                if (err) {
                    console.log(err);
                    return io.emit('WEBSOCKET_ERROR',  {message: err})
                }

                //flatten should be an option somewhere
                socketState.channels[channelName] = {
                    data: format.flatten(data),
                    lastSent: Date.now()
                }
                console.log(channelName + " sent !", socketState.status)
                return io.emit(channelName, socketState.channels[channelName].data);
            });
        }
    }

    //to clean
    setInterval(() => updateRestData('ORDERS'), delays.ORDERS);
    setInterval(() => updateRestData('BALANCES'), delays.BALANCES);
    setInterval(() => updateRestData('TRADES'), delays.TRADES);

    exchanges.map((e) => { 
        handleSocketsOpen[e]();
        handleSocketsError[e]();
        handleSocketsClose[e]();
    });

    io.on('connection', (socket) => {
        console.log('Tickers WS connected');

        socket.on('REQUEST_ORDERS', () => {
            updateRestData('ORDERS');
        })

        socket.on('REQUEST_TRADES', () => {
            updateRestData('TRADES');
        })

        socket.on('REQUEST_TICKERS', () => {
            sendTickers();
        })

        socket.on('REQUEST_BALANCES', () => {
            updateRestData('BALANCES');
        })

        socket.on('CANCEL_ORDER', (order) => {
            io.emit('WEBSOCKET_PENDING', {message: 'Cancelling order...'})

            cancelOrder(order, (err, res) => {
              console.log(err,res);
              if (err) {
                io.emit('WEBSOCKET_ERROR', {message: 'Could not cancel order' })
              }
              else {
                //NEED TO CREATE CANCEL_ORDER_SUCCESS to remove order from client
                io.emit('WEBSOCKET_SUCCESS', {message: 'Order cancelled !'})
              }
            })
            console.log('cancelOrder', order)
        })

        socket.on('BUY_LIMIT', ({orders}) => {
            io.emit('WEBSOCKET_PENDING', {message: 'Passing order...'})

            passOrders(orders, (err,res) => {
                console.log(err,res);
                err ? io.emit('WEBSOCKET_ERROR', {message: err}) : io.emit('WEBSOCKET_SUCCESS', {message: 'Order added !'})
            })
        })

        socket.on('SELL_LIMIT', ({orders}) => {
            passOrders(orders, (err,res) => {
                console.log(err,res);
                err ? io.emit('WEBSOCKET_ERROR', {message: err}) : io.emit('WEBSOCKET_SUCCESS', {message: 'Order added !'})
            })
        })
    })
}
