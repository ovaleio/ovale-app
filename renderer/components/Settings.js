import React from 'react';
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/settings'
import { Link, Route } from 'react-router-dom'

import EditCredentials from '../components/EditCredentials'

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
		height: "12px",
		width: "12px"
	},
	link: {
		color: 'white',
		textDecoration: 'none'
	},
	exchangeLogo: {
		width: '16px',
		height: '16px'
	},
	alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}}
}

class Settings extends React.Component {

  render() {
  	const { exchanges } = this.props;

	const listExchanges = exchanges.map((e, i) => (
		<div className="row" style={styles.categoryItem} key={i}>
			<img style={styles.exchangeLogo} src={`static/images/exchanges/${e}.png`} className="col-xs-2"/>
			<Link style={styles.link} to={ `/settings/${e}`} className="col-xs-8">{e}</Link>
		</div>
	))

    return (
    	<div style={styles.main} className="row">
        	<div id="leftColumn" style={styles.leftColumn} className="col-xs-3 col-sm-2">
        		<div style={styles.categoryHeader} className="row">
        			Connected Exchanges
        		</div>
    			{listExchanges}
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