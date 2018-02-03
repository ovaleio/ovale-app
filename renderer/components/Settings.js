import React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux'
import { initSocket } from '../actions/actions'
import { mapStateToProps } from '../selectors/settings'
import { Link, Route } from 'react-router-dom'

import EditCredentials from '../components/EditCredentials'
import * as ExchangesIcons from '../components/ExchangesIcons'

const styles = {
	main: {
		height: '100vh',
		color: 'white',
		fontFamily: 'Lato, Helvetica'
	},
	leftColumn: {
		background: 'rgba(0,0,0,0.35)',
    	paddingLeft: '15px'
	},
	mainColumn: {

	},
	categoryHeader: {
		padding: "2px 5px",
		lineHeight: "26px",
		backgroundColor: "rgba(0, 0, 0, 0.25)",
		fontSize: "16px",
		fontWeight: "bold",
		color: "#72EAD6"
	},
	"categoryItem": {
		padding: "0 10px",
		fontSize: "13px",
		lineHeight: "20px",
		textTransform: 'capitalize'
	},
	"symbol": {
		fontWeight: "bold"
	},
	logoExchange: {
		width: '24px',
		height: '24px'
	},
	link: {
		color: 'white',
		textDecoration: 'none'
	},
	alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}}
}

class Settings extends React.Component {

  componentDidMount() {
    ipcRenderer.send('REQUEST_SETTINGS')
  }

  render() {
  	const { exchanges, dispatch } = this.props;
  	let listExchanges;

	if (exchanges) {
	  listExchanges = exchanges.map((e, i) => (
		<div className="row" style={styles.categoryItem} key={i}>
			<div className="col-xs-2">
				{ExchangesIcons[`${e}Icon`]({viewBox: '0 0 124 124', style: styles.logoExchange})}
			</div>
			<Link style={styles.link} to={ `/settings/${e}`} className="col-xs-8">{e}</Link>
		</div>
	  ))
	}

    return (
    	<div style={styles.main} className="row">
        	<div id="leftColumn" style={styles.leftColumn} className="col-xs-3 col-sm-2">
        		<div style={styles.categoryHeader} className="row">
        			Connected Exchanges
        		</div>
    				{listExchanges}

    			<div style={styles.categoryHeader} className="row">
    				Websocket
    			</div>
    			<div className="row" style={styles.categoryItem} onClick={() => dispatch(initSocket())}>
    				Restart Websocket
    			</div>
        	</div>
        	<div id="mainColumn" className="col-xs-9 col-sm-10">
        		<div className="row">
        			<div className="col-xs-offset-10"><Link to="/" style={styles.link}>Close</Link></div>
        		</div>
        		<Route exact path="/settings" render={() => (<div>Choose an exchange on the left</div>)} />
        		<Route path="/settings/:exchange" component={EditCredentials} />
        	</div>
        </div>
    )
  }
}


export default connect(mapStateToProps)(Settings)