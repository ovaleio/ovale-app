import react from 'react'
import ReactDom from 'react-dom';
import io from 'socket.io-client';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import format from '../format.js';
import SearchBox from './SearchBox.js';
import TickersList from './TickersList.js';
import SocketStatus from './SocketStatus.js';
import TickerContainer from './TickerContainer.js';
import Orders from './Orders.js';
import Balances from './Balances.js';
import flexbox from '../static/flexbox.css'

//import '../static/style.css';

//allow react dev tools work

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
  mainColumn: {
    // height: "100%",
  }, 
  userDataContainer: {
    borderTop: "1px solid #D2E4E1",
    height: "45vh",
    overflow: "scroll"
    // minHeight: "300px"
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
        tickers: {},
        status: {}
      },
      currentTicker: "bitfinex:USD-BTC",
      baseCurrency: "BTC",
      searchQuery: ""
    }

    this.onClickTicker = this.onClickTicker.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (e) {
    //console.log(e.target.name, e.target.value);
    this.setState({[e.target.name]: e.target.value});
  }

  onCancelOrder (order) {
    fetch('http://localhost:8080/orders/delete', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
        //,'Content-Type': 'application/json' hack to prevent option instead of post
      },
      body: JSON.stringify(order)
    })
    .then(res => {
      console.log(res)
      if (res.ok) {
        //remove order from array
        var index = this.state.orders.indexOf(order);
        this.setState({
          data: this.state.data.filter((_,i) => i !== index)
        })
      }
      else {
        console.log("could not cancel order", order)
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
      
      //Receive channels message and set data in state
      var channels = ['tickers', 'orders', 'balances', 'status'];
      channels.map((e,i) => {
        socket.on(e, res => {
          console.log(e, res);
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
      <div style={styles.main}>
        <style global jsx>{`
          body, div, p {
            margin: 0;
          }

          input:focus, select:focus, textarea:focus,button:focus {
            outline: "none";
          }
        `}</style>
        <style global jsx>
          {flexbox}
        </style>
        <div id="leftColumn" style={styles.leftColumn} className="col-xs-2">
          <SearchBox searchQuery={this.state.searchQuery} onChange={this.handleInputChange} ref="childComponents"></SearchBox>
          <TickersList 
            tickers={this.state.data.tickers}
            searchQuery={this.state.searchQuery}
            currentTicker={this.state.currentTicker}
            onClickTicker={this.onClickTicker}
            style="flex-grow:1"
            ref="childComponents" 
          ></TickersList>
          <SocketStatus status={this.state.data.status} ref="childComponents"></SocketStatus>
        </div>
        <div id="mainColumn" style={styles.mainColumn} className="col-xs-10">
          <TickerContainer currentTicker={this.state.currentTicker} tickers={this.state.data.tickers} className="row"></TickerContainer>
          <div id="userData" style={styles.userDataContainer} className="row">
            <Orders 
              orders={this.state.data.orders} 
              tickers={this.state.data.tickers}
              onClickTicker={this.onClickTicker} 
              ref="childComponents">
            </Orders>
            <Balances 
              balances={this.state.data.balances}
              tickers={this.state.data.tickers}
              baseCurrency={this.state.baseCurrency}
              onClickTicker={this.onClickTicker} 
              ref="childComponents"
            ></Balances>
          </div>
        </div>
      </div>
    )
  }
}

export default Main