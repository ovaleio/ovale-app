// const {clients, format} = process.NODE_ENV === 'dev' ? require('/Users/johnthillaye/Code/cryptotrader/cryptoclients') : require('cryptoclients'); //grab dev version if exists
const {clients, format} = require('cryptoclients');
const {ipcMain} = require('electron')

module.exports = (credentials) => {
    if (!credentials) throw 'No API credentials';

    const {libraries, exchanges, getRestData, cancelOrder, passOrders} = clients(credentials);

    const request = require('request');
    const async = require('async');

    const channels = ['ORDERS', 'TICKERS', 'BALANCES', 'TRADES'];
    const delays = {TICKERS: 3000, ORDERS: 30010, BALANCES: 61020, TRADES: 300314};

    let socketState = {
        status: exchanges.reduce((o, exchange) => {o[exchange] = false; return o; }, {}),
        channels: channels.reduce((o, channelName) => {o[channelName] = {data: {}, lastSent: 0}; return o;}, {})
    };

    console.log('Initialized Socket', socketState);

    const exchangeSockets = {
        'bitfinex': () => {
            const ws = libraries['bitfinex'].ws();

            ws.on('open', () => {
                console.log("Bitfinex Websocket connected");
                updateStatus('bitfinex', true);
                libraries['bitfinex'].rest(2).symbols((err, symbols) => {
                    if (err) return;

                    symbols.forEach((symbol) => {
                        var betaSymbol = 't' + symbol.toUpperCase()
                        ws.subscribeTicker(betaSymbol)
                        ws.onTicker({symbol: betaSymbol}, (ticker) => {
                          updateTickers("bitfinex", symbol, ticker[6])
                        });
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
        'poloniex': () => {

            libraries['poloniex'].on('open', () => {
              updateStatus('poloniex', true);
              libraries['poloniex'].subscribe('ticker');
              libraries['poloniex'].on('message', handleTickerData.poloniex);
            })

            libraries['poloniex'].on('error', (err) => {
              console.log(`Poloniex Websocket An error has occured`, err);
            });
            libraries['poloniex'].on('close', (reason, details) => {
              updateStatus("poloniex", false, reason);
            });
            libraries['poloniex'].openWebSocket({ version: 2 });
        },
        'bittrex': () => {

            libraries['bittrex'].websockets.client(function() {
                updateStatus('bittrex', true);

                libraries['bittrex'].getmarketsummaries(function (res, err) {
                    if (err) console.log(err);

                    var symbols = res.result.map((e,i) => { 
                        updateTickers('bittrex', e.MarketName, e.Last)
                        return e.MarketName
                    })
                    libraries['bittrex'].websockets.subscribe(symbols, handleTickerData.bittrex)
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
        }
    }

    function updateTickers (exchange, pair, price) {
        pair = format[exchange].from.pair(pair);
        var symbol = exchange + ':' + pair;
        socketState.channels.TICKERS.data[symbol] =  parseFloat(price); //write perf to check here

        var now = Date.now();
        if (now > (socketState.channels.TICKERS.lastSent + delays.TICKERS)) {
          socketState.channels.TICKERS.lastSent = now;
          // sendTickers();
        }

    }

    function updateStatus (exchange, status) {
        socketState.status[exchange] = status;
        //return io.emit('STATUS', socketState.status);
    }

    const sendTickers = (event) => {
        var cleanData = Object.keys(socketState.channels.TICKERS.data).map((symbol) => {
            var [exchange,pair] = symbol.split(':');
            return {symbol: symbol, price: socketState.channels.TICKERS.data[symbol], pair: pair, currencies: pair.split('-'), exchange: exchange}
        })
        console.log("TICKERS sent !")
        return event.sender.send('TICKERS', cleanData);
    }

    const handleCancelOrder = (event, order) => {
        event.sender.send('WEBSOCKET_PENDING', {message: 'Cancelling order...'})

        cancelOrder(order, (err, res) => {
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

        passOrders(orders, (err,res) => {
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
    const updateRestData = (event, channelName) => {
        //Check that channel has been asked for
        if (channels.indexOf(channelName) !== -1) {
            //RETURN A PENDING MESSAGE
            event.sender.send('WEBSOCKET_PENDING', {message: 'Loading ' + channelName})

            console.log(channelName, ' rest data called');

            getRestData[channelName.toLowerCase()]((err, data) => {
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
    }

    exchanges.map((e) => exchangeSockets[e]());

    ipcMain.on('BUY_LIMIT', handleNewOrder)
    ipcMain.on('SELL_LIMIT', handleNewOrder)
    ipcMain.on('REQUEST_DATA', updateRestData)
    ipcMain.on('REQUEST_TICKERS', sendTickers)
    ipcMain.on('CANCEL_ORDER', handleCancelOrder)
}
