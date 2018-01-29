const {clients, format} = process.NODE_ENV === 'dev' ? require('/Users/johnthillaye/Code/cryptotrader/cryptoclients') : require('cryptoclients'); //grab dev version if exists

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

module.exports = (credentials) => {
    if (!credentials) throw 'No API credentials';

    const {libraries, exchanges, getRestData, cancelOrder, passOrders} = clients(credentials);

    http.listen(7070, function(){
      console.log('listening on *:7070');
    });

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
          sendTickers();
        }

    }

    function sendTickers () {
        var cleanData = Object.keys(socketState.channels.TICKERS.data).map((symbol) => {
            var [exchange,pair] = symbol.split(':');
            return {symbol: symbol, price: socketState.channels.TICKERS.data[symbol], pair: pair, currencies: pair.split('-'), exchange: exchange}
        })
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

    exchanges.map((e) => exchangeSockets[e]());

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
                io.emit('REMOVE_ORDER', {order_id: order.id})
                io.emit('WEBSOCKET_SUCCESS', {message: 'Order cancelled !'})
              }
            })
        })


        const handleOrder = ({orders}) => {
            io.emit('WEBSOCKET_PENDING', {message: 'Passing order...'})

            passOrders(orders, (err,res) => {
                console.log(err,res);
                
                if (err) {
                    io.emit('WEBSOCKET_ERROR', {message: err && typeof err === 'Error' ? err.toString() : err}) 
                } else {
                    io.emit('ADD_ORDERS', {orders});
                    io.emit('WEBSOCKET_SUCCESS', {message: 'Order added !'})
                }
            })
        }

        socket.on('BUY_LIMIT', handleOrder)
        socket.on('SELL_LIMIT', handleOrder)
    })
}
