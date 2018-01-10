import react from 'react'
import ReactDom from 'react-dom';
import Head from 'next/head'
import io from 'socket.io-client';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchBox from './SearchBox.js';
import TickersList from './TickersList.js';
import SocketStatus from './SocketStatus.js';
import TickerContainer from './TickerContainer.js';
import Orders from './Orders.js';
import Trades from './Trades.js';
import Balances from './Balances.js';
import flexbox from '../static/flexbox.css'
import Snackbar from 'material-ui/Snackbar'
import {clients} from 'cryptoclients'

const {getRestData, passOrder, cancelOrder, getOrders} = clients();

const muiTheme = getMuiTheme({ userAgent: 'all'});

const styles = {
  main: {
    backgroundColor: "#123932",
    width: "100vw",
    height: "100vh",
    color: "#CCC",
    fontFamily: "Helvetica",
    fontSize: "12px",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden"
  },
  leftColumn: {
    padding: 0,
    borderRight: "1px solid #D2E4E1"
  },
  userDataContainer: {
    borderTop: "1px solid #D2E4E1",
    height: "45vh",
    overflow: "scroll"
  }
};

const socket = io('http://localhost:7070', {forceNew: true});

class Main extends react.Component {

  constructor() {
    super()
    this.state = {
      data: {
        orders: [],
        balances: [],
        trades: [],
        tickers: {},
        status: {},
        totalBalance: {'BTC': 0, 'USD': 0}
      },
      currentTicker: 'bitfinex:USD-BTC',
      currentTab: 'Orders',
      sort: {
        'orders': {
          sortKey: 'date',
          direction: -1
        },
        'balances': {
          sortKey: 'currency',
          direction: 1
        },
        'trades': {
          sortKey: 'date',
          direction: -1
        }
      },
      baseCurrency: "BTC",
      searchQuery: "",
      openSnackbar: false,
      requestMessage: ""
    }

    this.onClickTicker = this.onClickTicker.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSnackbarClose () {
    this.setState({openSnackbar: false, requestMessage: ""})
  }

  handleNewOrder (payload) {
    if (!payload || !payload.orders) return false;

    payload.orders.forEach((order) => {
      passOrder(order, (err, res) => {
        if (err) {
          console.log(err, res)
          this.showSnackbar(res.message || res.error || err);
        } 
        else {
          this.showSnackbar(`Order successfully added`);

          //Reload orders
          getOrders((err, res) => {
            this.setState(({data}) => ({data: {
                ...data,
                orders: res
              }
            }));
          });
          this.computeData();
        }
      });
    })
  }

  showSnackbar (message, success) {
    var style = success ? {color: "white"} : {color: 'red'};
    this.setState({openSnackbar: true, requestMessage: <div style={style}>{message.toString()}</div>});
  }

  showOrdersTradesTab () {
    if (this.state.currentTab === 'Trades') {
      return (
        <Trades 
          trades={this.state.data.trades} 
          tickers={this.state.data.tickers}
          onClickTicker={this.onClickTicker}
          onSwitch={this.switchOrdersTradesTab.bind(this)}
          ref="childComponents">
        </Trades>
      )
    }
    else {
      return (
        <Orders 
          orders={this.state.data.orders} 
          tickers={this.state.data.tickers}
          onClickTicker={this.onClickTicker}
          onCancelOrder={this.onCancelOrder.bind(this)}
          onSwitch={this.switchOrdersTradesTab.bind(this)}
          onSort={this.sortTable.bind(this)}
          ref="childComponents">
        </Orders>
      )
    }
  }

  sortTable (type, key, direction) {
    const sort = this.state.sort[type];
    var direction = direction ? direction : (sort.key === key ?  -1 * sort.direction : sort.direction)
    var change = {
      sort: {
        ...this.state.sort,
        [type]: {
          sortKey: key,
          direction: direction
        }
      }
    }
    this.setState(change);
  }

  switchOrdersTradesTab () {
    var tab = this.state.currentTab === 'Orders' ? 'Trades' : 'Orders'
    this.setState({currentTab: tab});
  }

  onCancelOrder (order) {
    cancelOrder(order, (err, res) => {
      if (err) {
        this.showSnackbar('Could not cancel order');
        console.log("could not cancel order", order, err)
      }
      else {
        //remove order from array
        var index = this.state.data.orders.indexOf(order);
        this.setState(({data}) => ({
          data: {
            ...data,
            orders: this.state.data.orders.filter((_,i) => i !== index)
          }
        }));
        this.showSnackbar('Orders succesfully cancelled', true);
      }
    })
  }

  onClickTicker (currentTicker) {
    this.setState({currentTicker: currentTicker});
  }

  componentWillMount() {
  }

  componentDidMount() {
    if (this.refs.childComponents) {

      //Load all data via rest ONCE
      Object.keys(getRestData).map((e,i) => {
        getRestData[e]((err, res) => {
          this.setState(({data}) => ({data: {
              ...data,
              [e]: res
            }
          }));
          this.computeData();
        })
      });

      //Receive almost realtime updates from websocket
      var channels = ['tickers', 'orders', 'balances', 'trades', 'status'];
      channels.map((e,i) => {
        socket.on(e, res => {
          this.setState(({data}) => ({data: {
              ...data,
              [e]: res
            }
          }));
          this.computeData();
        }) 
      })
    }
  }

  getTicker (exchange, currency1, currency2) {
    const {tickers} = this.state.data;
    const btcusd = tickers['bitfinex:BTC-USD'] || tickers['poloniex:BTC-USDT'] || 0;



    var symbol = exchange + ':' + currency1 + '-' + currency2;
    var symbol_inverse = exchange + ':' + currency2 + '-' + currency1;
    var symbol_tryusdt = exchange + ':USDT' + '-' + currency2;
    var symbol_btc_fallback = exchange + ':BTC-' + currency2;

    //If pair is symetric
    if (currency1 == currency2) {
      return 1;
    } //If the symbols exists
    else if (tickers[symbol]) {
      return tickers[symbol]
    } //If the opposite symbol exists
    else if (tickers[symbol_inverse]) {
      return 1 / tickers[symbol_inverse]
    } //If no ticker exist when base currency is USD, try a fallback on btc
    else if (currency1 === 'USD') {
      if (tickers[symbol_tryusdt]) return tickers[symbol_tryusdt];
      else if (tickers[symbol_btc_fallback]) return (1 / btcusd) * tickers[symbol_btc_fallback];
      else return 0;
    }
    else {
      return 0;
    }
  }

  computeData (obj) {
    const {baseCurrency, sort} = this.state;
    const {tickers, orders, balances, trades} = this.state.data;
    
    var totalBalance = {'BTC': 0, 'USD': 0};


    console.log(sort);

    var newOrders = orders
      .map((order) => {
        var price = tickers[order.symbol] ? tickers[order.symbol] : '0'
        return {
          ...order,
          price: price,
          deltaPercent: ((1 - (price / order.rate)) * 100).toPrecision(4)
        }
      }).sort((a,b) => {
        return (a[sort['orders'].sortKey] > b[sort['orders'].sortKey]) ? sort['orders'].direction : ((b[sort['orders'].sortKey] > a[sort['orders'].sortKey]) ? -1 * sort['orders'].direction : 0)
      });

    var newBalances = balances.map((balance) => {
      if (!balance) return;

      var price = this.getTicker(balance.exchange, baseCurrency, balance.currency) || 0;

      var totalValue = {
        BTC: balance.balance * price,
        USD: balance.balance * price 
      }
      
      //add to total balance aggregeate
      totalBalance = {
        BTC: totalBalance.BTC + parseFloat(totalValue.BTC),
        USD: totalBalance.USD + parseFloat(totalValue.USD)
      }

      //add to balance object
      var balance = {
        ...balance,
        price: price,
        totalValue: totalValue
      }

      return balance;
    })


    newBalances = newBalances
      .map((b) => ({...b, share: b.totalValue[baseCurrency] / totalBalance[baseCurrency]}))
      .sort((a,b) => {
        return (a[sort['balances'].sortKey] > b[sort['balances'].sortKey]) ? sort['balances'].direction : ((b[sort['balances'].sortKey] > a[sort['balances'].sortKey]) ? -1 * sort['balances'].direction : 0)
      });

    this.setState( ({data}) => ({data: {
      ...data,
      orders: newOrders,
      balances: newBalances,
      totalBalance: totalBalance
    }}));
  }
   

  render() {
    return (
      <div>
        <Head>
          <title>CryptoTrader</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        </Head>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.main}>
            <style global jsx>{`
              body, div, p {
                margin: 0;
                padding: 0
              }
              table {
                  border-collapse: collapse;
              }
              input:focus, select:focus, textarea:focus,button:focus {
                outline: "none"
              }
              ::selection { background: white; /* WebKit/Blink Browsers */ }
            `}</style>
            <style global jsx>
              {flexbox}
            </style>
            <div id="leftColumn" style={styles.leftColumn} className="col-xs-3 col-sm-2">
              <SearchBox searchQuery={this.state.searchQuery} onChange={this.handleInputChange} ref="childComponents"></SearchBox>
              <TickersList 
                tickers={this.state.data.tickers}
                searchQuery={this.state.searchQuery}
                currentTicker={this.state.currentTicker}
                onClickTicker={this.onClickTicker}
                ref="childComponents" 
              ></TickersList>
              <SocketStatus status={this.state.data.status} ref="childComponents"></SocketStatus>
            </div>
            <div id="mainColumn" className="col-xs-9 col-sm-10">
              <TickerContainer 
                currentTicker={this.state.currentTicker} 
                tickers={this.state.data.tickers}
                handleNewOrder={this.handleNewOrder.bind(this)}
                className="row"
              ></TickerContainer>
              <div id="userData" style={styles.userDataContainer} className="row">
                {this.showOrdersTradesTab()}
                <Balances 
                  balances={this.state.data.balances}
                  total={this.state.data.totalBalance}
                  baseCurrency={this.state.baseCurrency}
                  onClickTicker={this.onClickTicker}
                  onSort={this.sortTable.bind(this)}
                  ref="childComponents"
                ></Balances>
              </div>
            </div>          
              <Snackbar
                open={this.state.openSnackbar}
                message={this.state.requestMessage}
                onRequestClose={this.handleSnackbarClose.bind(this)}
                autoHideDuration={6000}
              />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default Main