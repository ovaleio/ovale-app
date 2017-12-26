import react from 'react'
import ReactDom from 'react-dom'

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
			var exchange = obj[0];
			var symbol = obj[1].replace(/^(\w+)-(\w+)$/, "$2$1").toLowerCase(); //check cryptowatch input should be all lowercase symbols
			return `https://embed.cryptowat.ch/${exchange}/${symbol}`
		}
		else return null;
	}

	render() {
		const {width, height, currentTicker} = this.props;
		const url = this.getTickerUrl(currentTicker);

		if (url) return (<div style={styles.main}><iframe src={url} frameBorder="0" allowFullScreen="true" style={styles.iframe}></iframe></div>);
		else return (<p>No ticker url</p>);
	}
}

export default TickerChart