import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux'
import { closeSettingsDialog }  from '../actions/actions'
import { mapStateToProps } from '../selectors/settingsDialog'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const settings = require('electron-settings');
const credentials = settings.get('credentials');
const exchanges = settings.get('supportedExchanges');

var form = {exchange: "", apikey: "", apisecret: ""}
const handleChange = (e) => { form[e.target.name] = e.target.value }
const save = () => {
  if (exchanges.includes(form.exchange)) {
    settings.set('credentials', {...credentials, [form.exchange]: {apikey: form.apikey, apisecret: form.apisecret}})
    alert("Keys updated ! Please Reload the app")
  }
  else {
    alert("Exchange not supported yet");
  }
}

class SettingsDialog extends React.Component {

  render() {
    const { open, dispatch } = this.props

    const hasKeys = exchanges.map((e) => credentials && credentials[e] ? <div>{e}: OK !</div> : <div>{e}: No keys</div>)

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={() => dispatch(closeSettingsDialog())}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Add/Edit API KEYS"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={() => dispatch(closeSettingsDialog())}
          autoScrollBodyContent={true}
        >
          { hasKeys }

          Exchange<br/>
          <input type="text" name="exchange" onChange={handleChange} /><br/>
          API KEY<br/>
          <input type="text" name="apikey" onChange={handleChange} /><br/>
          API SECRET<br/>
          <input type="text" name="apisecret" onChange={handleChange} /><br/>
          <button onClick={save}>save</button>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SettingsDialog)