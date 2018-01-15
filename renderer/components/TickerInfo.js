import react from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentTicker } from '../actions/ticker'
import styles from '../styles/TickerInfo'

class TickerInfo extends react.Component {

  render () {
  	const {dispatch, price, variation, currentTickerSymbol} = this.props;

  	return (
  		<div style={styles.main} >
			<div className="row">
				{ currentTickerSymbol }
			</div>
			<div className="row">
				<div style={styles.tickerPrice} className="col-xs-7">{price}</div>
				<div style={styles.tickerVariation} className="col-xs-5">
					{/*<FontIcon
				      className="material-icons"
				      style={styles.iconStyle}
				    >arrow_downward</FontIcon>*/}
				   <span>{variation}%</span>
			    </div>
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