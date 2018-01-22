import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { saveSettings, handleChangeSettings } from '../actions/actions'
import { mapStateToProps } from '../selectors/editCredentials'

const styles = {
	form: {
		backgroundColor: "rgba(0, 0, 0, 0.25)",
		padding: "30px 40px"
	},
	input: {
		height: '30px',
		backgroundColor: 'rgba(255,255,255, 0.10',
		border: 'none',
		color: 'white',
	    boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.15)",
	},
	saveButton: {
	    height: "30px",
	    backgroundColor: "#14ae35",
	    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.35)",
	    fontSize: "16px",
	    border: "none",
	    color: "white",
	    borderRadius: 0
	}
}

class EditCredentials extends React.Component {

	render () {
		const { exchange, credentials, dispatch } = this.props

		return (
			<div>
				<div className="row">
					<h1 className="col-xs-offset-1 col-xs-8">Edit "{exchange}" API Credentials</h1>
					<div className="col-xs-1"><Link to="/app">Close</Link></div>
				</div>
				<div className="row">
					<form className="col-xs-offset-1 col-xs-10 col-lg-8" style={styles.form}>
						<div className="row" style={{marginBottom: "20px"}}>
			    			<label className="col-xs-2">API KEY</label>
			    			<input type="text" size="64" name="apikey" className="col-xs-9 col-xs-offset-1" style={styles.input} onChange={(e) => dispatch(handleChangeSettings({target: e.target, exchange: exchange}))} value={credentials.apikey} />
			    		</div>
						<div className="row" style={{marginBottom: "20px"}}>
			    			<label className="col-xs-2">API SECRET</label>
			    			<input type="text" size="64" name="apisecret" className="col-xs-9 col-xs-offset-1" style={styles.input} onChange={(e) => dispatch(handleChangeSettings({target: e.target, exchange: exchange}))} value={credentials.apisecret} />
			    		</div>
			    		<div className="row">
			    			<button onClick={(e) => { e.preventDefault(); dispatch(saveSettings({exchange}))}} className="col-xs-offset-8 col-xs-4" style={styles.saveButton}>SAVE</button>
			    		</div>
					</form>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps)(EditCredentials)