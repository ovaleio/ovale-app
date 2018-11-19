import react from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../../selectors/tickers'
import { setCurrentTicker, setSearchQueryTickers } from '../../../actions/actions'
import { Link } from 'react-router-dom'
import * as ExchangesIcons from '../../system/ExchangesIcons'
import numberFormat from '../../../helpers/numberFormat';
import './tickers.css'

import SearchTickerForm from '../SearchTickerForm/SearchTickerForm'

class Tickers extends react.Component {

  	componentDidMount() {
		ipcRenderer.send('REQUEST_TICKERS')
		let intervalId = setInterval(() => ipcRenderer.send('REQUEST_TICKERS'), 16000);
		this.setState({intervalId: intervalId});
		console.log("Mount tickers")
  	}

  	componentWillUnmount() {
		if(this.state !== null && this.state.intervalId !== null) {
			console.log('Unmount tickers')
			clearInterval(this.state.intervalId);
		}
  	}

  render () {
  	const {dispatch, tickers} = this.props;

  	var rows = tickers.map((ticker, i) => {
  		return (
			<div 
				className="row tickers-row row-even cursor-pointer"
				onClick={() => dispatch(setCurrentTicker({symbol: ticker.symbol}))} 
				key={ticker.symbol}
			>
				<div className="col-xs-1 tickers-logo-exchange">
					{ExchangesIcons[`${ticker.exchange}Icon`]({viewBox: '0 0 200 200'})}
				</div>
				<div className="col-xs-6 tickers-symbol">
					{ticker.pair}
				</div>
				<div className="col-xs-5 tickers-prices">
					{numberFormat.format(ticker.price, 8, false, 9)}
				</div>
			</div>
		)
	})

  	return (
  		<div>
			<div className="tickers-main">
				<SearchTickerForm
				onChange={(e) => dispatch(setSearchQueryTickers({query: e.target.value}))}
				onSubmit={(e)=> {e.preventDefault()}}
				/>
				<div className="tickers-content">
					{rows.length ? rows : (<p>Loading tickers...<br/><br/>If nothing happens, make sure you have keys configured in <Link to="/settings">Settings</Link></p>)}
				</div>
			</div>
			<div className="handle"></div>
		</div>
	);
  }
}

export default connect(mapStateToProps)(Tickers)
