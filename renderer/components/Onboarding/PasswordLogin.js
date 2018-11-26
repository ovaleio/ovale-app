import React, { Component } from 'react'

import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'
import {userLogin, onboardingFirstStep, emailSetMessage} from '../../actions/actions'
import Error from './Error';

class PasswordLogin extends Component {
  
  constructor() {
    super();
    this.state = {
      password:'',
      buttonText:'Next',
      disabled : false,
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange = e => {
    if(this.state.disabled === true)
    {
      this.setState({disabled:false});
    }
    // We remove the errors if there is novalue at all
    this.setState({errors:[]})
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const { password, errors } = this.state;
    const {user, dispatch}  = this.props;
    this.setState({disabled:true})

    if(errors.length === 0) {
      dispatch(userLogin(user.email, password))
    }
    this.setState({disabled:false})
    return false;
  }

  // dispatching an action based on state change
  componentWillUpdate(nextProps, nextState) {
    
    if (nextProps.message != "") {
      nextState.errors = [...nextState.errors, nextProps.message];
      nextProps.dispatch(emailSetMessage(''));
    }
  }

  
  render() {
    const {  user, dispatch } = this.props;
   
   // Grab 'em to the user
   if (this.state.errors.length>0 ) {
      var Errors = <Error errors={this.state.errors} />
    } else {
      var Errors = [];
    }
    return (
      
      <div>
       
       <div className="row">
          <div className="col-xs-12 onboarding-text-header">
            <p>
              Welcome back {user.email} !<br />Please enter your password.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <form name="login" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-xs-12">
                  <input type="password"
                    className="input col-xs-12" 
                    name="password" 
                    autoFocus
                    placeholder="Your password"
                    value={this.state.password}
                    onChange={e => this.handleChange(e)} />
                </div>
              </div>
              <button id="loginButton" disabled={this.state.disabled} className="button col-xs-12">{this.state.buttonText}</button>
              {Errors}
              <div className="row">
                <div className="col-xs-12">
                  <br />
                  <p>Not you ? Try with <a href="#" onClick={() => dispatch(onboardingFirstStep())}>another account !</a></p>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        
      </div>
    )
  }
}


export default connect(mapStateToProps)(PasswordLogin)