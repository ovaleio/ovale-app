import react from 'react'
import ReactDom from 'react-dom'

const styles = {
	main: {
		overflowY: "scroll",
		height: "90vh"
	},
	categoryHeader: {
		padding: "2px 5px",
		lineHeight: "26px",
		backgroundColor: "rgba(0, 0, 0, 0.25)",
		fontSize: "14px",
		fontHeight: "bold",
		color: "#72EAD6"
	},
	"categoryItem": {
		// lineHeight: "20px",
		padding: "2px 5px",
		maxWidth: "100%"
	},
	"symbol": {
		fontWeight: "bold"
	}
}

class TickersList extends react.Component {

  //inherits tickers, searchQuery, onClickTicker from main
  constructor(props) {
    super(props)
  }

  handleClick (symbol) {
  	this.props.onClickTicker(symbol);
  }

  render () {
  	var rows = [];
  	if (this.props.tickers) {
  		for (const [symbol, price] of Object.entries(this.props.tickers)) { 
  			var jsx = (
  				<div className="row" style={styles.categoryItem} onClick={() => this.handleClick(symbol)} key={symbol}>
	  				<div className="col-xs-8" style={styles.symbol}>{symbol}</div>
	  				<div className="col-xs-4">{price}</div>
	  			</div>);

  			if (!this.props.searchQuery.length || symbol.match(new RegExp(this.props.searchQuery, 'i'))) {
  				rows.push(jsx);
  			}
  		}
  	}

  	var  message = (this.props.searchQuery.length && !rows.length) ? 'No ticker found for ' + this.props.searchQuery : ''
  	
  	return (
  		<div style={styles.main}>
  			<div style={styles.categoryHeader}>Tickers</div>
  			<div>
  				{message}
  				{rows}
  			</div>
  		</div>
	);
  }
}

export default TickersList;

  // 		<Category>
		// 	<CategoryHeader>
		// 		BITFINEX
		// 	</CategoryHeader>
		// 	<CategoryItems>
		// 		<div class="categoryItem row">
		// 			<div class="symbol">BTC</div>
		// 			<div class="spacer"></div>
		// 			<div class="symbolPrice alignRight">17 817.33 USD</div>
		// 		</div>
		// 		<div class="categoryItem row">
		// 			<div class="symbol">BTC</div>
		// 			<div class="spacer"></div>
		// 			<div class="symbolPrice alignRight">15 120.23 EUR</div>
		// 		</div>
		// 	</CategoryItems>
		// </Category>