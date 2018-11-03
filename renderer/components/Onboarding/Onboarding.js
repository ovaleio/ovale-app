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
import Password          from './Password'
import PasswordLogin     from './PasswordLogin'

import "./css/onboarding.css"

class Onboarding extends React.Component {
  constructor() {
    super();
    this.state = {
      view:''
    }
  }
  componentDidUpdate(prevProps){
    const { user,  step } = this.props

    //Wrap it in a conditionnal to avoid an infinite loop (see https://reactjs.org/docs/react-component.html#componentdidupdate)
    if(prevProps.step !== step) {

      if(step === 1) {
        this.showStep1()
      }

      // Si Step 2 sans email trouvé dans l'api, on register
      if(step === 2) {
        this.setState({
          view:<EmailVerification />
        }) 
      }

      // Si Step 3, on demande un mot de passe
      if( step===3 ) {
        this.setState({
          view:<Password/>
        }) 
      }

      // Si Step 4, on login
      if(step===4) {
        this.setState({
          view:<PasswordLogin />
        })
      }

      // both login and register display this state
      // Si Step 666, on save le jwt et balance sur l'accueil
      if(step===666) {
        ipcRenderer.send('UPDATE_USER', {email:user.email, jwt:user.jwt})
        this.setState({
          view:<Redirect to='/app' />
        })
      }
    }
    
  }

  showStep1() {
    const {  step, userSettings, dispatch } = this.props
    //Si step 1 et que l'on a en magasin un email user, on dispatch emailsuccess.
    if(step===1) {
      if(userSettings.email) {
        dispatch(emailSuccess(userSettings.email))
      } else {
        this.setState({
          view:<Login2 submit={(email) => {dispatch(emailLogin(email))}}/>
        }) 
      }
    }
  }
  componentDidMount() {
    this.showStep1()
  }
  render() {
    

    return (
        <div className="row">
          <div className="col-xs-12">

            <div className="row">
              <div className="col-xs-12 center-xs">

                {/* HEADER */}
                <div className="row onboarding-header">
                  <div className="col-xs-12">
                    <img className="img-fluid" src="./static/ovale-logo.png" />
                  </div>
                </div>
                
                {/* BODY */}
                <div className="row onboarding-body around-sm">
                  <div className="col-xs-5">


                      {this.state.view}


                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
        
    )
  }
}


export default connect(mapStateToProps)(Onboarding)