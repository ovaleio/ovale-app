import react from 'react'
import ReactDom from 'react-dom'
import FontIcon from 'material-ui/FontIcon'

const styles = {
	main: { 
		fontSize: "22px",
		padding: "20px",
	    maxHeight: "110px"
	},
	tickerPrice: {
		fontWeight: "bold"
	},
	tickerVariation: {
		color: "#EA3147",
		fontSize: "18px"
	},
	iconStyle: {
		color: "#EA3147"
	}
}

class TickerInfo extends react.Component {

  //gets tickers && currentTicker
  constructor(props) {
    super(props)
  }

  render () {
  	const {tickers, currentTicker} = this.props;
  	const price = tickers ? tickers[currentTicker] : 0;

  	return (
  		<div style={styles.main} >
			<div className="row">{ currentTicker }</div>
			<div className="row">
				<div style={styles.tickerPrice} className="col-xs-7">{price}</div>
				<div style={styles.tickerVariation} className="col-xs-5">
					<FontIcon
				      className="material-icons"
				      style={styles.iconStyle}
				    >arrow_downward</FontIcon>
				   <span>5.20%</span>
			    </div>
			</div>
		</div>
	)
  }
}

export default TickerInfo;