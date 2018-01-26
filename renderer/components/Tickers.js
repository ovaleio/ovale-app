import react from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/tickers'
import SearchTickerForm from './SearchTickerForm'
import { setCurrentTicker, setSearchQueryTickers } from '../actions/actions'
import { Link } from 'react-router-dom'
import styles from '../styles/Tickers'
import ActionSettings from 'material-ui/svg-icons/action/settings';

class Tickers extends react.Component {
  toggleHover () {

  }

  render () {
  	const {dispatch, tickers} = this.props;

  	var rows = tickers.map((ticker, i) => {
  		return (
			<div 
				className="row rowHover"
				style={Object.assign({}, styles.categoryItem, styles.alternateRow(i))}
				onClick={() => dispatch(setCurrentTicker({symbol: ticker.symbol}))} 
				key={ticker.symbol}
			>
				<div className="col-xs-2 col-lg-1">
					<img style={styles.logoExchange} src={`static/images/exchanges/${ticker.exchange}.png`} />
				</div>
				<div className="col-xs-5 col-lg-5" style={styles.symbol}>{ticker.pair}</div>
				<div className="col-xs-5 col-lg-6">{ticker.price}</div>
			</div>
		)
	})

  	return (
  		<div>
	      	<SearchTickerForm onChange={(e) => dispatch(setSearchQueryTickers({query: e.target.value}))}/>
	  		<div>
	  			<div style={styles.categoryHeader} className="row">
	  				<div className="col-xs-10">Tickers</div>
	  				<div className="col-xs-2" style={{margin: 'auto', 'fontSize': '12px'}}>
	  					<Link to="/settings" className="row middle-xs" style={{textDecoration: 'none', color: '#DDD'}}>
	  						<ActionSettings
	  							style={{color: 'rgba(255,255,255,0.9)', width: '16px', height: '16px', display: 'flex'}} 
	  						/>
	  					</Link>
	  				</div>
	  			</div>
	  			<div style={styles.main}>
		  			<div style={styles.categoryContent}>
		  				{ rows.length ? rows : <div>No ticker data available.<br/>Please add API keys in Settings</div>}
		  			</div>
		  		</div>
	  		</div>
	    </div>
	);
  }
}

export default connect(mapStateToProps)(Tickers)