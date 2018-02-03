import react from 'react'
import { connect } from 'react-redux'
import styles from '../styles/TickerChart'
const remote = require('electron').remote;

class TickerChart extends react.Component {
	getTickerUrl(symbol) {
		if (symbol) {
			var obj = symbol.split(':');
			var exchange = obj[0].toUpperCase();
			var pair = obj[1].replace(/^(\w+)-(\w+)$/, "$2$1").toUpperCase(); //check cryptowatch input should be all lowercase symbols	

			// const devPath = `http://localhost:8000/static/tv.html?symbol=${exchange}:${pair}`
			// const prodPath = `file://${remote ? remote.app.getAppPath() : ''}/renderer/out/static/tv.html?symbol=${exchange}:${pair}`
			// return prodPath;
			//return process.env.NODE_ENV === 'production' ? prodPath : devPath
			return `http://jaytee.club/tv.html?symbol=${exchange}:${pair}`
		}
		else return null;
	}

	render() {
		const {currentTickerSymbol} = this.props;
		const url = this.getTickerUrl(currentTickerSymbol);

		return (<div style={styles.main}>
			<iframe src={url} frameBorder="0" allowFullScreen="true" style={styles.iframe}></iframe>
		</div>);
	}
}

const mapStateToProps = (state) => {
  return {
  	currentTickerSymbol: state.tickerReducer.currentTickerSymbol
  }
}

export default connect(mapStateToProps)(TickerChart)