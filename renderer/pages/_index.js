import react from 'react'
import ReactDom from 'react-dom';
import io from 'socket.io-client';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import format from '../format.js';
import Balances from './balances.js';
import Orders from './orders.js';
import OrderForm from './OrderForm';
import TickerChart from './TickerChart';
import TextField from 'material-ui/TextField';

//allow react dev tools work

const styles = {
  propTable: {
    width: 1200,
    overflow: 'hidden',
    margin: '20px auto 0'
  }
};

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
      baseCurrency: "BTC"
    }

    this.onClickTicker = this.onClickTicker.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }


  handleInputChange (e) {
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
    this.setState({currentTicker})
  }

  componentDidMount() {
    if (this.refs.childComponents) {
      const socket = io('http://localhost:7070');
      
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
    const { data, baseCurrency, currentTicker } = this.state
    return (
      <div>
        <pre>{currentTicker}</pre>
        <MuiThemeProvider>
          <TextField
              id="currentTicker"
              name="currentTicker"
              floatingLabelText="Ticker"
              floatingLabelFixed={true}
              value={currentTicker}
              onChange={this.handleInputChange}
            />
        </MuiThemeProvider>
        <TickerChart ticker={currentTicker} width="1000" height="420"></TickerChart>
        <MuiThemeProvider>
          <OrderForm ref="childComponents" tickers={data.tickers}></OrderForm>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <div style={styles.propTable}>
            <Orders ref="childComponents" tickers={data.tickers} orders={data.orders} baseCurrency={baseCurrency} onCancelOrder={this.onCancelOrder} onClickTicker={this.onClickTicker}></Orders>
          </div>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <div style={styles.propTable}>
            <Balances ref="childComponents" tickers={data.tickers} balances={data.balances} baseCurrency={baseCurrency} onClickTicker={this.onClickTicker}></Balances>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default Main