import react from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/tickers'
import { setCurrentTicker, setSearchQueryTickers } from '../actions/actions'
import { Link } from 'react-router-dom'
import ActionSettings from 'material-ui/svg-icons/action/settings';
import IconButton from 'material-ui/IconButton';
import * as ExchangesIcons from './ExchangesIcons'
import numberFormat from '../helpers/numberFormat';
import '../styles/css/tickers.css'

import SearchTickerForm from './SearchTickerForm'

class Tickers extends react.Component {

  componentDidMount() {
    let intervalId = setInterval(() => ipcRenderer.send('REQUEST_TICKERS'), 4000);
    this.setState({intervalId: intervalId});
    ipcRenderer.send('REQUEST_TICKERS')
  }

  componentWillUnmount() {
  	if(this.state!== null && this.state.intervalId !== null) {
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
			<SearchTickerForm
			onChange={(e) => dispatch(setSearchQueryTickers({query: e.target.value}))}
			onSubmit={(e)=> {e.preventDefault()}}
			/>
			<div className="row tickers-header">
				<div className="col-xs-12">
					<div className="row">
						<div className="col-xs-10 widget-title">Tickers</div>
						<div className="col-xs-2" style={{margin: 'auto', 'fontSize': '12px'}}>
							<Link to="/settings" className="row" style={{textDecoration: 'none', color: '#DDD'}}>
								<IconButton tooltip='Settings' style={{width: '16px', height: '16px', margin: 0, padding: 0, border: 0}} iconStyle={{color: 'rgba(255,255,255,0.9)', width: '16px', height: '16px', display: 'flex'}}>
									<ActionSettings/>
								</IconButton>
							</Link>
						</div>
					</div>
					
				</div>
			</div>
			<div className="row tickers-main">
				<div className="col-xs-12 tickers-content">
					{rows.length ? rows : (<p>Loading tickers...<br/><br/>If nothing happens, make sure you have keys configured in <Link to="/settings">Settings</Link></p>)}
				</div>
			</div>
		</div>
	);
  }
}

export default connect(mapStateToProps)(Tickers)
