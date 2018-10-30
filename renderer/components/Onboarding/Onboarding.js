import React from 'react';
import {connect} from 'react-redux';
import {
  Redirect
} from 'react-router-dom'
import {ipcRenderer} from 'electron'
import { mapStateToProps } from '../../selectors/users'

import {emailLogin, emailSuccess,  digitsCheck} from '../../actions/actions'

// Inside Components
import Login2            from './Login2'
import EmailVerification from './EmailVerification'
import Name              from './Name'
import Password              from './Password'
import PasswordLogin              from './PasswordLogin'

import "./css/onboarding.css"

class Onboarding extends React.Component {


  render() {
    const { user,  step, userSettings, dispatch } = this.props
    
    
    let view;
    // Si Step 1, on print Login2 (dispatch here, @todo put le dispatch dans le composant)
    if(step===1) {
      if(userSettings.email) {
        dispatch(emailSuccess(userSettings.email))
      } else {
        view = <Login2 submit={(email) => {dispatch(emailLogin(email))}}/>
      }
    }
    
    
    // Si Step 2 sans email trouvé dans l'api, on register
    if(step===2) {
      view = <EmailVerification submit={(digits) => {dispatch(digitsCheck(user.email, digits))}}/>
    }

    // Si Step 3, on demande un mot de passe
    if(step===3) {
      view = <Password/>
    }
    
    
    // Si Step 4 on demande le nom de l'utilisateur
    if(step===4) {
      view = <Name/>
    }
       
    // Si Step 10, on login
    if(step===10) {
      view = <PasswordLogin />
    }

    // both login and register display this state
    // Si Step 666, on save le jwt et balance sur l'accueil
    if(step===666) {
      console.log(user)
      ipcRenderer.send('UPDATE_USER', {email:user.email, jwt:user.jwt})
      view = <Redirect to='/app' />
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