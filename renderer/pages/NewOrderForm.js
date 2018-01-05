import react from 'react'
import ReactDom from 'react-dom'

const styles = {
	bottom20: {
		marginBottom: "20px"
	},
	main: {
		height: "200px",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
		borderTop: "1px solid #D2E4E1",
		flexGrow: 1,
	    padding: "24px 30px",
	    overflow: "hidden"
	},
	alignRight: {
		textAlign: "right"
	},
	selectRow: {
		margin: "0 0 20px 0"
	},
	select: {
		appearance: "none",
		borderRadius: 0,
		fontSize: "16px",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
		border: "solid 1px #ffffff",
		color: "white",
		padding: "5px",
		background: "url(./caret.png) rgba(0, 0, 0, 0.2) no-repeat right center",
	    flexGrow: 1
	},
	label: {
		marginBottom: "8px",
	    display: "block"
	},
	inputText: {
		fontSize: "16px",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
		border: "solid 1px #ffffff",
		color: "white",
	    padding: "5px",
	    width: "88%"
	},
	"spacer": {
		flexGrow: 1
	},
	"buttonContainer": {
		flexBasis: "47.5%"
	},
	"buyButton": {
		width: "100%",
	    height: "30px",
	    backgroundColor: "#14ae35",
	    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
	    fontSize: "16px",
	    border: "none",
	    color: "white",
	    borderRadius: 0
	},
	"sellButton": {
		width: "100%",
	    height: "30px",
	    backgroundColor: "#ce3a00",
	    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
	    fontSize: "16px",
	    border: "none",
	    color: "white",
	    borderRadius: 0
	}
}

class NewOrderForm extends react.Component {

  constructor(props) {
    super(props)

    this.state = {
      amount: "0",
      price: "0"
    }
  }

  componentDidMount () {
  	this.setState({price: "0"});
  }

  handleInputChange (e) {
    this.setState({[e.target.name]: e.target.value});
  }

  setPriceToLast () {
    const {tickers, currentTicker} = this.props;
	const price = tickers ? tickers[currentTicker] : 0;
	this.setState({price: price.toString()});
  }

  computeTotal () {
  	return parseFloat(this.state.amount) * parseFloat(this.state.price);
  }


  handleBuy (e) {
  	e.preventDefault();
  	const {amount, price} = this.state;
    var payload = {"orders": [{symbol: this.props.currentTicker, type: 'buy', amount: amount, rate: price}]}
    this.props.handleNewOrder(payload);
  }

  handleSell (e) {
  	e.preventDefault();
  	const {amount, price} = this.state;
    var payload = {"orders": [{symbol: this.props.currentTicker, type: 'sell', amount: amount, rate: price}]}
    this.props.handleNewOrder(payload);
  }

  render () {
  	return (
		<form style={styles.main}>
			<div style={styles.bottom20} className="row">
				<div className="col-xs-6">
					<label htmlFor="amount" style={styles.label}>AMOUNT</label>
					<input style={styles.inputText} type="number" autoComplete="off" name="amount" id="amount" value={this.state.amount} onChange={this.handleInputChange.bind(this)} />
				</div>
				<div  className="col-xs-6" style={styles.alignRight}>
					<label htmlFor="price" style={styles.label} onClick={this.setPriceToLast.bind(this)}>PRICE</label>
					<input style={styles.inputText} type="number" autoComplete="off" name="price" id="price" value={this.state.price} onChange={this.handleInputChange.bind(this)} />
				</div>
			</div>
			<div style={styles.selectRow} className="row">
				<select style={styles.select} name="orderType">
					<option>LIMIT ORDER</option>
					<option>MARKET ORDER</option>
					<option>MARGIN ORDER</option>
				</select>
			</div>
			<div className="row">
				<div className="col-xs-6">
					<button style={styles.buyButton} onClick={this.handleBuy.bind(this)}>BUY</button>
				</div>
				<div className="col-xs-6">
					<button style={styles.sellButton} onClick={this.handleSell.bind(this)}>SELL</button>
				</div>
			</div>
			<div className="row">
				Total: {this.computeTotal()}
			</div>
		</form>
  	)
  }
}

export default NewOrderForm;