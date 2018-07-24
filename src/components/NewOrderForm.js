import react from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from './selectors/newOrder'
import {buy, sell, setAmount, setPrice} from '../redux/actions/actions'
import styles from '../styles/NewOrderForm'

class NewOrderForm extends react.Component {

  render () {
  	const {dispatch, tickerSymbol, amount, price, availableBalance, currentPrice, currencies} = this.props;

  	return (
		<form style={styles.main}>
			<input type="hidden" name="tickerSymbol" value={tickerSymbol} />
			<div className="row" style={{marginBottom: '10px'}}>
				<div className="col-xs-6">
					<label htmlFor="amount" style={styles.label} onClick={() => { dispatch(setAmount({amount: availableBalance})) }}>AMOUNT {currencies[1]}</label>
					<input style={styles.inputText} type="number" autoComplete="off" name="amount" id="amount" value={amount} onChange={(e) => { dispatch(setAmount({amount: e.target.value})) }}/>
				</div>
				<div  className="col-xs-6" style={styles.alignRight}>
					<label htmlFor="price" style={styles.label} onClick={() => { dispatch(setPrice({price: currentPrice})) }}>PRICE</label>
					<input style={styles.inputText} type="number" autoComplete="off" name="price" id="price" value={price} onChange={(e) => { dispatch(setPrice({price: e.target.value})) }} />
				</div>
			</div>

			<div className="row" style={styles.bottom20} >

				<div className="col-xs-6">
					<label htmlFor="amount" style={styles.label}>TOTAL {currencies[0]}</label>
					<input style={{...styles.inputText, opacity: '0.7'}} type="number" disabled name="amount" id="amount" value={amount * price} />
				</div>
			</div>
			{/*<div style={styles.selectRow} className="row">
				<select style={styles.select} name="orderType">
					<option>LIMIT ORDER</option>
					{/*<option>MARKET ORDER</option>
					<option>MARGIN ORDER</option>}
				</select>
			</div>*/}
			<div className="row">
				<div className="col-xs-6">
					<button style={styles.buyButton} onClick={(e) => { e.preventDefault(); dispatch(buy(tickerSymbol, amount, price)) }}>BUY LIMIT</button>
				</div>
				<div className="col-xs-6">
					<button style={styles.sellButton} onClick={(e) => { e.preventDefault(); dispatch(sell(tickerSymbol, amount, price)) }}>SELL LIMIT</button>
				</div>
			</div>
		</form>
  	)
  }
}

export default connect(mapStateToProps)(NewOrderForm);