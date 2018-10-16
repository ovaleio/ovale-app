import React from 'react';
import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'
import {emailLogin} from '../../actions/actions'
import Login from './Login'
import Login2 from './Login2'

import "./css/onboarding.css"

class Onboarding extends React.Component {

  render() {
		const { dispatch } = this.props

    return (
        <div className="row center-xs">
          <div className="col-xs-10">

           {/* HEADER */}
            <div className="row onboarding-header">
              <div className="col-xs-12">
                <img className="img-fluid" src="./static/ovale-logo.png" />
              </div>
            </div>
            
            {/* BODY */}
            <div className="row onboarding-body around-sm">
              <div className="col-xs-5">
                <Login2 submit={(email) => {
				    				dispatch(emailLogin(email));
				    			}}/>

              </div>
            </div>

          </div>
        </div>
        
    )
  }
}


export default connect(mapStateToProps)(Onboarding)