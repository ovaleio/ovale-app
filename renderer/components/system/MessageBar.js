import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { mapStateToProps } from './../../selectors/messageBar'
import { closeSnackbar } from './../../actions/actions'


class MessageBar extends React.Component {
	render () {

    	const { showSnackbar, message, messageType, style, redirectTo, delay, dispatch} = this.props;

    	if (typeof message !== 'string') return null;

		return (
			<div>
				<Snackbar
		          open={showSnackbar}
		          message={message}
		          contentStyle={style}
		          onRequestClose={() => dispatch(closeSnackbar())}
		          autoHideDuration={delay ? delay : 1500}
		        />
		        { redirectTo ? (<Redirect to={redirectTo} />) : null }
		    </div>
	    )
    }
}

export default connect(mapStateToProps)(MessageBar)
