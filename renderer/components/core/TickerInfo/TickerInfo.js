import react from 'react'
import { connect } from 'react-redux'

// css
import './tickerInfo.css'

class TickerInfo extends react.Component {

  render () {
  	const {price, currentTickerSymbol} = this.props;

  	return (
  		<div className="tickerInfo">
			<div className="row">
				<div className="col tickerSymbol">
					{ currentTickerSymbol }
				</div>
			</div>
			<div className="row">
				<div className="col tickerPrice">
					{ price } 
				</div>
			</div>
		<div className="handle"></div>
		</div>
	)
  }
}

const mapStateToProps = (state) => { 
	const currentTicker = state.tickersReducer.data.find((t) => t.symbol === state.tickerReducer.currentTickerSymbol)
	return {
  		...state.tickerReducer,
		  price: currentTicker ? currentTicker.price : 0,
  	}
}

export default connect(mapStateToProps, null)(TickerInfo)