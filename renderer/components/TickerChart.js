import react from 'react'
import { connect } from 'react-redux'
import styles from '../styles/TickerChart'
const remote = require('electron').remote;
const path = require('path');

class TickerChart extends react.Component {
	componentDidMount() {
		// const webview = document.querySelector('webview')
		// webview.addEventListener('dom-ready', () => {
		//   webview.openDevTools()
		// })

		//webview.loadURL('file:///Users/johnthillaye/Code/cryptotrader/cryptotrader-app/dist/mac/OVALE.app/Contents/renderer/out/static/tv.html')
	}

	getTickerUrl(symbol) {
		if (symbol) {
			var obj = symbol.split(':');
			var exchange = obj[0].toUpperCase();
			var pair = obj[1].replace(/^(\w+)-(\w+)$/, "$2$1").toUpperCase(); //check cryptowatch input should be all lowercase symbols	

			const devPath = `http://localhost:8000/static/tv.html?symbol=${exchange}:${pair}`
			// const prodPath = `file://${remote.app.getAppPath().replace('/Resources/app.asar', '')}/renderer/out/static/tv.html`

			const prodPath = `http://ovale.io/tv.html?symbol=${exchange}:${pair}`

			return process.env.NODE_ENV === 'production' ? prodPath : devPath
		}
		else return null;
	}

	showChart(symbol) {
		const url = this.getTickerUrl(symbol);
		const b = url.replace(/tv\..+$/, 'tv.js');

		return (
			<webview 
				src={url}
				preload={b}
				style={styles.iframe}
			>
			</webview>
		)
	}

	render() {
		const {currentTickerSymbol} = this.props;

		return (
			<div style={styles.tickerChart}>
				{ remote ? this.showChart(currentTickerSymbol) : '' }
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
  	currentTickerSymbol: state.tickerReducer.currentTickerSymbol
  }
}

export default connect(mapStateToProps)(TickerChart)