import React, { Component } from 'react'

import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'
import {emailSetMessage, emailLogin} from '../../actions/actions'
import Error from './Error';
import validator from 'validator';




class EmailVerification extends Component {
  
  constructor() {
    super();
    this.state = {
      digits:'',
      buttonText:'Next',
      disabled : 'disabled',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  validate() {
    // store err in a single array
    const errors = [];
  
    if (!validator.isNumeric(this.state.digits)){
      errors.push("Digits are not valids");
    }
  
    return errors;
  }
  handleChange = e => {

    // When typing, we remove the errors
    if(e.target.value==="") {
      this.setState({errors:[]})
    }
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    const { digits } = this.state;

    // Validation
    const errors = this.validate();
    this.setState({errors})
    
    if(errors.length === 0) {
      this.props.submit(digits);
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
          <div className="col-xs-12">
            <p>
              Oh it’s your first time here ! 
            </p>
            <p>
              We have sent you a confirmation code by email.
            </p>
            <br />
            <p>
              Please enter the 6 digits code below
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <form name="login" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-xs-12">
                  <input type="text"
                    className="input col-xs-12" 
                    name="digits" 
                    placeholder="000000"
                    value={this.state.digits}
                    onChange={e => this.handleChange(e)} />
                </div>
              </div>
              {Errors}
              <button id="loginButton"  disabled={!this.state.digits} className="button col-xs-12">{this.state.buttonText}</button>
            </form>
          </div>
        </div>
        
        
      </div>
    )
  }
}


export default connect(mapStateToProps)(EmailVerification)