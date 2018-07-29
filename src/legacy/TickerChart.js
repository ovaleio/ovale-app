import react from 'react'

const styles = {
	main: {
		flexGrow: 1
	},
	iframe: {
	    width: "100%",
	    height: "100%",
	    border: 0
	}
}

class TickerChart extends react.Component {
	constructor(props) {
		super(props)
	}

	getTickerUrl(ticker) {
		if (ticker) {
			var obj = ticker.split(':');
			var exchange = obj[0].toUpperCase();
			var symbol = obj[1].replace(/^(\w+)-(\w+)$/, "$2$1").toUpperCase(); //check cryptowatch input should be all lowercase symbols
			return `http://jaytee.club/tv.html?symbol=${exchange}:${symbol}`
		}
		else return null;
	}

	render() {
		const {currentTicker} = this.props;
		const url = this.getTickerUrl(currentTicker);

		return (<div style={styles.main}>
			<iframe src={url} frameBorder="0" allowFullScreen="true" style={styles.iframe}></iframe>
		</div>);
	}
}

export default TickerChart
