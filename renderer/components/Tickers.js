import react from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/tickers'
import SearchTickerForm from './SearchTickerForm'
import { setCurrentTicker, setSearchQueryTickers } from '../actions/actions'
import { Link } from 'react-router-dom'
import styles from '../styles/Tickers'
import ActionSettings from 'material-ui/svg-icons/action/settings';
import IconButton from 'material-ui/IconButton';
import * as ExchangesIcons from './ExchangesIcons'

class Tickers extends react.Component {
  componentDidMount() {
    ipcRenderer.send('REQUEST_TICKERS')
    setInterval(() => ipcRenderer.send('REQUEST_TICKERS'), 4000)
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
				<div className="col-xs-1" style={{padding:0}}>
					{ExchangesIcons[`${ticker.exchange}Icon`]({viewBox: '0 0 124 124', style: styles.logoExchange})}
				</div>
				<div className="col-xs-6" style={styles.symbol}>{ticker.pair}</div>
				<div className="col-xs-5">{ticker.price}</div>
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
	  						<IconButton tooltip='Settings' style={{width: '16px', height: '16px', margin: 0, padding: 0, border: 0}} iconStyle={{color: 'rgba(255,255,255,0.9)', width: '16px', height: '16px', display: 'flex'}}>
	  							<ActionSettings/>
	  						</IconButton>
	  					</Link>
	  				</div>
	  			</div>
	  			<div style={styles.main}>
		  			<div style={styles.categoryContent}>
		  				{rows}
		  			</div>
		  		</div>
	  		</div>
	    </div>
	);
  }
}

export default connect(mapStateToProps)(Tickers)