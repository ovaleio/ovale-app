import React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux'
import { initSocket } from '../actions/actions'
import { mapStateToProps } from '../selectors/settings'
import { Link, Route } from 'react-router-dom'

class Onboarding extends React.Component {

  componentDidMount() {
    ipcRenderer.send('REQUEST_SETTINGS')
  }

  render() {
    const { exchanges, dispatch } = this.props;

    return (
      <div className="row">
        <div className="col-xs-12">
          test
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps)(Onboarding)