import React from 'react';
import {connect} from 'react-redux';
import { mapStateToProps } from '../../selectors/users'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import jwt from 'jsonwebtoken';
import {checkLicence} from '../../actions/actions'
var shell = require('electron').shell;

class CheckLicence extends React.Component {

  constructor() {
    super();
    this.state = {
      expired:false
    }
    this.getJWT = this.getJWT.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleQueDalle = this.handleQueDalle.bind(this);
    this.handlePay = this.handlePay.bind(this);
  };

  async getJWT() {
    // call server
    return this.props.dispatch(checkLicence(this.props.jwt));
  };

  async showPopup() {
    let jwtDecoded = await jwt.decode(this.props.user.jwt);
    if(jwtDecoded) {
      var date1 =  new Date();
      var date2 =  new Date(jwtDecoded.data.validUntil);
      var timeDiff = date2.getTime() - date1.getTime();
      if (timeDiff < 0) {
        this.handleOpen(true);
      } else {
        this.handleOpen(false);
      }
    }
    
  }
  handleOpen = (bool) => {
    this.setState({expired: (bool)});
  };

  

  handleClose = () => {
    this.setState({expired: false});
    const app = require('electron').remote.app
    app.exit();
  };
  handleQueDalle = () => {

  };
  handlePay = () =>{
    let jwt = btoa(this.props.jwt);
    event.preventDefault();
    shell.openExternal('https://ovale.io/pay?licence='+jwt);
  }
  componentDidMount() {
    this.showPopup();
    this.getJWT().then(()=>{
      
      //Set Interval
      this.interval = setInterval(()=>{
        this.getJWT().then(()=>{
          this.showPopup();
        });
      }, 30*1000);
    });
    
  }
  copmponentWillUnmount(){
    clearInterval(this.interval);
  }
  render() {
    const actions = [
      <FlatButton
        label="Quit"
        className="btn-secondary"
        style={{float:'left'}}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Subscribe"
        className="btn-primary" 
        onClick={this.handlePay}
      />
    ];
    return (
      <div>
        <Dialog
          titleClassName="dialog-font-bg dialog-title"
          bodyClassName="dialog-font-bg dialog-content"
          paperClassName="dialog-font-bg"
          contentClassName="dialog"
          actionsContainerClassName="dialog-font-bg"
          title="Trial Expired"
          actions={actions}
          modal={false}
          open={this.state.expired}
          onRequestClose={this.handleQueDalle}
        >
          Your period has expired. In order to continue using OVALE, you will have to subscribe to one of our plans.
        </Dialog>
      </div>
    );
  }
}


export default connect(mapStateToProps)(CheckLicence)

