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

const config = require('/Users/johnthillaye/config.js');

const lib = clients(config) //pass apikeys to clients

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
        status: {}
      },
      currentTicker: "bitfinex:USD-BTC",
      currentTab: 'Orders',
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
      lib.passOrder(order, (err, res) => {
        if (err) {
          console.log(err, res)
          this.showSnackbar(res.message || res.error || err);
        } 
        else {
          this.showSnackbar(`Order successfully added`);

          //Reload orders
          lib.getOrders((err, res) => {
            this.setState(({data}) => ({data: {
                ...data,
                orders: res
              }
            }));
          });
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
          ref="childComponents">
        </Orders>
      )
    }
  }

  switchOrdersTradesTab () {
    var tab = this.state.currentTab === 'Orders' ? 'Trades' : 'Orders'
    this.setState({currentTab: tab});
  }

  onCancelOrder (order) {
    lib.cancelOrder(order, (err, res) => {
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
      //Get rest data
      const getRestData = lib.getRestData;

      //e = orders, balances, ..
      Object.keys(getRestData).map((e,i) => {
        getRestData[e]((err, res) => {
          this.setState(({data}) => ({data: {
              ...data,
              [e]: res
            }
          }));
        })
      });

      //Receive channels message and set data in state
      var channels = ['tickers', 'orders', 'balances', 'status'];
      channels.map((e,i) => {
        socket.on(e, res => {
          this.setState(({data}) => ({data: {
              ...data,
              [e]: res
            }
          }));
        }) 
      })
    }
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
              body, div, p, th, td {
                margin: 0,
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
                  tickers={this.state.data.tickers}
                  baseCurrency={this.state.baseCurrency}
                  onClickTicker={this.onClickTicker} 
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