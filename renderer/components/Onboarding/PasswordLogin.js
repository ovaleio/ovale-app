import React, { Component } from 'react'

import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'
import {userLogin, emailSetMessage} from '../../actions/actions'
import Error from './Error';

class PasswordLogin extends Component {
  
  constructor() {
    super();
    this.state = {
      password:'',
      buttonText:'Next',
      disabled : 'disabled',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange = e => {
    // We remove the errors if there is novalue at all
    if(e.target.value==="") {
      this.setState({errors:[]})
    }
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    const { password, errors } = this.state;
    const {user}  = this.props;

    if(errors.length === 0) {
      this.props.dispatch(userLogin(user.email, password))
    }
    return false;
  }

  render() {
   
    const {  message, dispatch } = this.props;

    if(message != "") {
      this.state.errors.push(message);
      dispatch(emailSetMessage(''));
    }
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
              Welcome back ! Please enter your password.
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
                    placeholder="Your password"
                    value={this.state.name}
                    onChange={e => this.handleChange(e)} />
                </div>
              </div>
              <button id="loginButton"  disabled={!this.state.password} className="button col-xs-12">{this.state.buttonText}</button>
              {Errors}
            </form>
          </div>
        </div>
        
        
      </div>
    )
  }
}


export default connect(mapStateToProps)(PasswordLogin)