import react from 'react'
import ReactDom from 'react-dom';
import TickerChart from './TickerChart.js';
import TickerInfo from './TickerInfo.js';
import NewOrderForm from './NewOrderForm.js';

const styles = {
	main: {
		height: "55vh",
		minHeight: "300px"
	},
	tickerCol: { /* ok in ticker container */
		width: "280px",
		borderLeft: "1px solid #D2E4E1",
		display: "flex",
		flexDirection: "column"
	}
}

class TickerContainer extends react.Component {
	//inherit currentTicker
	constructor (props) {
		super(props)
	}

	render () { 
		const {currentTicker, tickers} = this.props;

		return (
			<div style={styles.main} className="row">
		        <TickerChart currentTicker={currentTicker} width="800" height="420"></TickerChart>
		        <div style={styles.tickerCol}>
		          <TickerInfo currentTicker={currentTicker} tickers={tickers}></TickerInfo>
		          <NewOrderForm currentTicker={currentTicker} tickers={tickers}></NewOrderForm>
		        </div>
		    </div>
		)
	}
}

export default TickerContainer