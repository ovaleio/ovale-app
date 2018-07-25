import react from 'react'
import { connect } from 'react-redux'
import styles from '../styles/TickerInfo'

class TickerInfo extends react.Component {

  render () {
  	const { price, currentTickerSymbol } = this.props;

  	return (
  		<div style={styles.main} >
			<div className="row">
				{ currentTickerSymbol }
			</div>
			<div className="row" style={styles.tickerPrice}>
				{ price }
			</div>
		</div>
	)
  }
}

const mapStateToProps = (state) => {
	const currentTicker = state.tickersReducer.data.find((t) => t.symbol === state.tickerReducer.currentTickerSymbol)
	return {
  		...state.tickerReducer,
  		price: currentTicker ? currentTicker.price : 0
  	}
}

export default connect(mapStateToProps, null)(TickerInfo)
