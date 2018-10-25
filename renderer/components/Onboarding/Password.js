import React, { Component } from 'react'

import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'
import {register, emailSetMessage} from '../../actions/actions'
import Error from './Error';

class Password extends Component {
  
  constructor() {
    super();
    this.state = {
      password:'',
      password2:'',
      buttonText:'Next',
      disabled : 'disabled',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange = e => {

    this.validate();

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
    const {  user, jwt, dispatch } = this.props;
    console.log(jwt)
    if(errors.length === 0) {
      dispatch(register(user.email, password, jwt))
    }
    return false;
  }

  componentDidMount() {
    const { message } = this.state;
    const { dispatch } = this.props;

    if(message != "") {
      this.setState({message});
      dispatch(emailSetMessage(''));
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
              Alright {user.name} ! Let's protect your account, create a password.
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
                      placeholder="Choose a password"
                      value={this.state.password}
                      onChange={e => this.handleChange(e)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <input type="password"
                      className="input col-xs-12" 
                      name="password2" 
                      placeholder="Repeat your password"
                      value={this.state.password2}
                      onChange={e => this.handleChange(e)} />
                  </div>
                </div>
              {Errors}
              <button id="loginButton"  disabled={(!this.state.password || !this.state.password2 ) || this.state.password != this.state.password2} className="button col-xs-12">{this.state.buttonText}</button>
            </form>
          </div>
        </div>
        
        
      </div>
    )
  }
}


export default connect(mapStateToProps)(Password)