import React from 'react';
import { ipcRenderer } from 'electron';

import Login from './Login'
import Login2 from './Login2'

import "./css/onboarding.css"

class Onboarding extends React.Component {
  submitEmail(email){
      console.log(email)
  }
  render() {

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
                <Login2 submit={this.submitEmail}/>
              </div>
            </div>

          </div>
        </div>
        
    )
  }
}


export default Onboarding