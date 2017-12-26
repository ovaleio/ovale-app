import react from 'react';
import ReactDom from 'react-dom';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';

class OrderForm extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchange: "bitfinex",
      symbol: "USD-BTC",
      orderType: "buy",
      amount: "0.01",
      price: "0.01",
      openDialog: false,
      requestMessage: "",
      openSnackbar: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  handleOpen () {
    this.setState({openDialog: true});
  };

  handleClose () {
    this.setState({openDialog: false});
  };

  handleSnackbarClose () {
    this.setState({openSnackbar: false, requestMessage: ""})
  }

  handleSubmit () {
    const {exchange, symbol, orderType, amount, price} = this.state;
    var payload = {"orders": [{exchange: exchange, type: orderType, pair: symbol, amount: amount, rate: price}]}
    console.log("handleSubmit called");
    this.postRequest('http://localhost:8080/orders', payload, res => {
      //if there is an error, we have a res.code & res.message
      if (res.code) {
        this.setState({openSnackbar: true, requestMessage: this.snackbarMessage(res.message)})
      }
      else {
        console.log(res);
        this.setState({openSnackbar: true, requestMessage: this.snackbarMessage(`${res.length} orders added`, true)})
      }
    });
  }

  snackbarMessage (message, success) {
    var icon = success ? 'check circle' : 'error';
    var style = success ? {color: "white"} : {color: 'red'};
    return (<div style={style}><FontIcon className="material-icons">{icon}</FontIcon> {message}</div>)
  }

  postRequest (url, payload, callback) {
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
        //,'Content-Type': 'application/json' hack to prevent option instead of post
      },
      body: JSON.stringify(payload)
    })
    //.then(this.handleErrors)
    .then(res => res.json())
    .then(callback)
    .catch(err => console.log())
  }

  getItems() {
    const {tickers} = this.props;
    const {exchange, symbol, orderType, amount, price} = this.state;
    let exchangesItems, symbolsItems, total, currentPrice;

    if (tickers && tickers[exchange]) {
      exchangesItems = Object.keys(tickers).map((exchange, i) => {
        return (<MenuItem key={i} value={exchange} primaryText={exchange} />)
      })
      symbolsItems = Object.keys(tickers[exchange]).map((symbol, i) => {
        return (<MenuItem key={i} value={symbol} primaryText={symbol} />)
      })

      currentPrice = tickers[exchange][symbol];
    }
    total = parseFloat(amount) * parseFloat(price);

    return {exchangesItems, symbolsItems, total, currentPrice};
  }

  handleSelectChange (name, target, index, value) {
    const {tickers} = this.props;

    switch (name) {
      case 'exchange':
        this.setState({exchange: value, symbol: Object.keys(tickers[value])[0]})
        break;
      default:
        this.setState({[name]: value});
    }
  }

  handleInputChange (e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    const {exchange, symbol, orderType, amount, price, requestMessage} = this.state;
    var {exchangesItems, symbolsItems, total, currentPrice} = this.getItems();

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <RaisedButton label="Add Order" onClick={this.handleOpen.bind(this)} />
        <Dialog
          title="Pass Order"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
          onRequest={this.handleClose.bind(this)}
        >
          <SelectField
            name="exchange"
            floatingLabelText="Exchange"
            value={exchange}
            onChange={this.handleSelectChange.bind(this, 'exchange')}
          >
            {exchangesItems}
          </SelectField><br/>
          <SelectField
            name="symbol"
            floatingLabelText="Pair"
            value={symbol}
            onChange={this.handleSelectChange.bind(this, 'symbol')}
          >
            {symbolsItems}
          </SelectField><br/>
          <SelectField 
            name="orderType"
            floatingLabelText="Buy or Sell"
            value={orderType}
            onChange={this.handleSelectChange.bind(this, 'orderType')}
          >
            <MenuItem value="buy" primaryText="BUY" />
            <MenuItem value="sell" primaryText="SELL" />
          </SelectField><br/>
          <TextField
            id="amount"
            name="amount"
            floatingLabelText="Amount"
            floatingLabelFixed={true}
            value={amount}
            onChange={this.handleInputChange}
          /><br/>
          <TextField
            id="price"
            name="price"
            floatingLabelText="Price"
            floatingLabelFixed={true}
            value={price}
            onChange={this.handleInputChange}
          />
          <br/>
          {orderType} {amount}{symbol} at {price} @{exchange} for {total}
          <br/>
          <strong>Current Price: {currentPrice}</strong>
        </Dialog>
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.requestMessage}
          onRequestClose={this.handleSnackbarClose}
          autoHideDuration={6000}
        />
      </div>
    );
  }
}

export default OrderForm