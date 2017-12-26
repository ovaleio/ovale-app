import react from 'react'
import ReactDom from 'react-dom'

const styles = {
	main: { 
		fontSize: "22px",
		padding: "20px",
	    maxHeight: "110px"
	},
	p: {
		margin: 0,
		lineHeight: "36px"
	},
	tickerPrice: {
		fontWeight: "bold"
	},
	tickerVariation: {
		color: "#EA3147",
		fontSize: "18px"
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
  		<div style={styles.main}>
			<p style={styles.p}>{ currentTicker }</p>
			<p style={styles.p}>
				<span style={styles.tickerPrice}>{price}</span>
				<span style={styles.tickerVariation}>(caret) 5.20%</span>
			</p>
		</div>
	)
  }
}

export default TickerInfo;