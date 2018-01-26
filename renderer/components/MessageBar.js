import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import { connect } from 'react-redux'

import { mapStateToProps } from '../selectors/messageBar'
import { closeSnackbar } from '../actions/actions'


class MessageBar extends React.Component {
	render () {

    	const { showSnackbar, message, messageType, style, dispatch} = this.props;

		return (
			<Snackbar
	          open={showSnackbar}
	          message={message}
	          contentStyle={style}
	          onRequestClose={() => dispatch(closeSnackbar())}
	          autoHideDuration={messageType === 'error' ? 4800 : 1500}
	        />
	    )
    }
}

export default connect(mapStateToProps)(MessageBar)