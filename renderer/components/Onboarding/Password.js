import React, { Component } from 'react'

import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'
import {register, emailSetMessage} from '../../actions/actions'
import validator from 'validator'
import Error from './Error';

class Password extends Component {
  
  constructor() {
    super();
    this.state = {
      password:'',
      password2:'',
      buttonText:'Next',
      disabled: true,
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
    this.erase = this.erase.bind(this);
  }
  erase = () => {
    if(this.state.password ==='' && this.state.password === this.state.password2)
    {
      this.setState({errors:[], disabled:true});
    }
  }

  validate = ()=>{
    let errors = []
    if (!validator.isLength(this.state.password, {min:8})){
      errors.push("Your password should have at least 8 characters");
    }
    if (this.state.password2 != '' && this.state.password !== this.state.password2){
      errors.push("Your passwords must match");
    }
    if (this.state.password2 === ''){
      errors.push("You must enter 2 times your password.");
    }
    this.setState({errors});
    this.setState({disabled: (errors.length>0)})
    return (errors.length>0)?false:true;
  }
  
  handleChange = e => {

    this.setState({
      [e.target.name]: e.target.value
    }, ()=> {
      if(this.validate()) {
        this.setState({disabled: false })
      }
      
      this.erase();
    })
    
   
   
  }

  handleSubmit(e) {
    e.preventDefault();

    const { password, errors } = this.state;
    const {  user, jwt, dispatch } = this.props;
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
              Great! Now let's protect your account, create a password.
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
                      autofocus
                      placeholder="Choose a password"
                      value={this.state.password}
                      onChange={e => this.handleChange(e)}
                     
                       />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <input type="password"
                      className="input col-xs-12" 
                      name="password2" 
                      placeholder="Repeat your password"
                      value={this.state.password2}
                      onChange={e => this.handleChange(e)}
                      onBlur={this.erase}
                       />
                  </div>
                </div>
              <button id="loginButton" disabled={this.state.disabled} className="button col-xs-12">{this.state.buttonText}</button>
              {Errors}
            </form>
          </div>
        </div>
        
        
      </div>
    )
  }
}


export default connect(mapStateToProps)(Password)