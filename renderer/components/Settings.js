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
		padding: "2px 5px",
		maxWidth: "100%",
		fontSize: "12px"
	}
}

class Settings extends React.Component {

  render() {
  	const { exchanges } = this.props;

	const listExchanges = exchanges.map((e) => (
		<div style={styles.categoryItem}  className="row">
			<Link to={ `/settings/${e}`}>{e}</Link>
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
        		<Route path="/settings/:exchange" component={EditCredentials} />
        	</div>
        </div>
    )
  }
}


export default connect(mapStateToProps)(Settings)