import React from 'react';
import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'

import {emailLogin, digitsCheck} from '../../actions/actions'


// Inside Components
import Login2            from './Login2'
import EmailVerification from './EmailVerification'
import Name              from './Name'
import Password              from './Password'

import "./css/onboarding.css"
class Onboarding extends React.Component {

  render() {
    const { user, step, dispatch } = this.props
    let view;

    // Si Step 1, on print Login2
    if(step===1) {
      view = <Login2 submit={(email) => {dispatch(emailLogin(email))}}/>
    }

    // Si Step 3 sans email trouvé dans l'api, on register
    if(step===3) {
      view = <EmailVerification submit={(digits) => {dispatch(digitsCheck(user.email, digits))}}/>
    }
    
    // Si Step 4 on demande le nom de l'utilisateur
    if(step===4) {
      view = <Name/>
    }
       
    // Si Step 5, on demande un mot de passe
    if(step===5) {
      view = <Password/>
    }

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


                  {view}


              </div>
            </div>

          </div>
        </div>
        
    )
  }
}


export default connect(mapStateToProps)(Onboarding)