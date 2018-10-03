const {clients, format} = require('./library/cryptoclients'); //grab dev version if exists
const {ipcMain} = require('electron')
const request = require('request');
const async = require('async');

var socketState = {};

const connectWS = {
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

        return ws;
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

        return lib;
    },
    'bittrex': (lib) => {
        lib.websockets.client(function() {
            updateStatus('bittrex', true);

            lib.getmarketsummaries(function (res, err) {
                if (err) console.log(err);

                var symbols = res.result.map((e,i) => { 
                    //Allow us to load all bittrex tickers data at once
                    updateTickers('bittrex', e.MarketName, e.Last)
                    return e.MarketName
                })
                lib.websockets.subscribe(symbols, handleTickerData.bittrex)
            });
        });
    },
    'binance': (lib) => {
        lib.websockets.miniTicker(handleTickerData.binance);
        return lib;
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
    },
    "binance": (markets) => {
      Object.keys(markets).forEach((pair) => {
        //console.log(pair, markets[pair].close);
        updateTickers("binance", pair, markets[pair].close)
      })
    }
}

const updateTickers = (exchange, pair, price) => {
    pair = format[exchange].from.pair(pair);
    var symbol = exchange + ':' + pair;
    socketState.channels.TICKERS.data[symbol] = parseFloat(price); //write perf to check here
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

const initSockets = (credentials, channels) => {
    credentials = credentials || global.credentials;
    channels = channels || ['TICKERS'];

    const Clients = new clients({credentials});
    socketState = {
        status: Clients.exchanges.reduce((o, exchange) => {o[exchange] = false; return o; }, {}),
        channels: channels.reduce((o, channelName) => {o[channelName] = {data: {}, lastSent: 0}; return o;}, {})
    };
    console.log('Initialized Socket', socketState);

    //Add listener
    ipcMain.on('REQUEST_TICKERS', sendTickers)

    return Clients.exchanges.map((e,i) => ({ exchange: e, ws: connectWS[e](Clients.libraries[i]) }) );
}

const closeSockets = (exchangeSockets) => {
    exchangeSockets = exchangeSockets || global.websockets;
    const closeMethods = {
        'bitfinex': (ws) => ws.close(),
        'poloniex': (lib) => lib.closeWebSocket(),
        'bittrex': (lib) => null,
        'binance': (lib) => null,
    }

    if (exchangeSockets) {
        exchangeSockets.map((s) => closeMethods[s.exchange](s.ws))
    }

    //Remove listeners
    ipcMain.removeAllListeners('REQUEST_TICKERS')
}

const restartSockets = () => {
    closeSockets();
    return initSockets();
}

module.exports = {
    init: initSockets,
    close: closeSockets,
    restart: restartSockets
}