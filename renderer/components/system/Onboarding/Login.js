import React from 'react';
import {Redirect} from 'react-router-dom'
import Error from './Error.js'
import validator from 'validator';
import {remote, ipcRenderer} from 'electron';
import axios from "axios";

function validate(email, password) {
  // store err in a single array
  const errors = [];

  if (!validator.isEmail(email)){
    errors.push("Email is not valid");
  }
  if(!validator.isLength(password, {min:6})) {
    errors.push("Password must be over 6 characters");
  }

  return errors;
}

class Login extends React.Component {
  constructor() {
    super();
    this.api = null;
    this.state = {
      requestFullfiled:'',
      buttonText:'Login',
      email : "",
      password : "",
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
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    const {  email, password } = this.state;

    // Validation
    const errors = validate(email, password);
    this.setState({errors})

    // Logic in case of errors
    if (errors.length !==0) {
      return;
    } else {

        // We post a request to the api
        axios.post(this.api+'/users/authenticate', {
          email: this.state.email,
          password: this.state.password
        })
        // if we are successfull.
        .then( res => {

          if(res.data.email !== undefined){

            // Update JWT
            ipcRenderer.send('UDPATE_EMAIL', {mail: res.data.email, jwt:res.data.jwt});

            // Erase errors and redirect
            this.setState({
              requestFullfiled:<Redirect to="/" />,
              errors: []
            })

          } else {
            throw new Error('unexpected error on login')
          }
        })
        //we catch errors
        .catch(res => {
          errors.push("This email/password is not associated with an actual account.");
          this.setState({errors})
        });
    }
  }
  componentDidMount(){
    // Retrieve global config for the api url and set in in the window.
    this.api = remote.getGlobal('api');
  }
  render() {

    if (this.state.errors.length>0) {
      var Errors = <Error errors={this.state.errors} />
    } else {
      var Errors = "";
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
                    name ="email" 
                    autofocus
                    placeholder="Enter your email here" 
                    value={this.state.email} 
                    onChange={e => this.handleChange(e)} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <input 
                  type="password" 
                  className="input col-xs-12" 
                  name ="password" 
                  placeholder="Enter your password here" 
                  value={this.state.password} 
                  onChange={e => this.handleChange(e)} />
                </div>
              </div>
              {Errors}
              <button id="loginButton" className="button col-xs-12">{this.state.buttonText}</button>
            </form>
          </div>
        </div>
        
      </div>
    )
  }
}


export default Login