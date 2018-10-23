import React from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import Error from './Error.js';
import validator from 'validator';
import {emailSetMessage} from '../../actions/actions'
import { mapStateToProps } from '../../selectors/users'

function validate(email) {
  // store err in a single array
  const errors = [];

  if (!validator.isEmail(email)){
    errors.push("Email is not valid");
  }

  return errors;
}

class Login2 extends React.Component {
  constructor() {
    super();
    this.state = {
      requestFullfiled:'',
      buttonText:'Login',
      email : "",
      disabled : false,
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    if(this.state.disabled === true)
    {
      this.state.disabled = false;
    }
    if(e.target.value==="") {
      this.setState({errors:[]})
    }
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    

    const { email } = this.state;

    // Validation
    const errors = validate(email);
    this.setState({disabled:true, errors})
    
    if(errors.length === 0) {
      this.props.submit(this.state.email);
    }
    return false;
  }

  render() {

    const { message, dispatch } = this.props

    if(message) {
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
        {this.state.requestFullfiled}
        <div className="row center-xs">
          <div className="col-xs-12">
            <form name="login" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-xs-12">
                  <input type="text"
                    className="input col-xs-12" 
                    name="email" 
                    placeholder="Enter your email here" 
                    value={this.state.email} 
                    onChange={e => this.handleChange(e)} />
                </div>
              </div>
              <button id="loginButton"  disabled={this.state.disabled} className="button col-xs-12">{this.state.buttonText}</button>
              {Errors}
            </form>
          </div>
        </div>
        
      </div>
    )
  }
}


Login2.propTypes = {
  submit: propTypes.func.isRequired
}


export default connect(mapStateToProps)(Login2)