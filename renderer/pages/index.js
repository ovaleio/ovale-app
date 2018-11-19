import React from 'react'
import {ipcRenderer} from 'electron'
import {
  Route,
  Switch
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from '../containers/App'
import Settings from '../components/system/Settings'
import Onboarding from '../components/system/Onboarding/Onboarding.js'
import MessageBar from '../components/system/MessageBar'


import initStore from '../initStore'
import history from '../history';
import { init as websocketInit } from '../websocket'

// CSS
import "../styles/css/flexboxgrid.css";
import "../styles/css/global.css";
import "../styles/css/fonts.css";

const muiTheme = getMuiTheme({ userAgent: 'all', fontFamily: 'Lato, Helvetica, sans-serif'});
const store = initStore();
websocketInit(store);

class Root extends React.Component {


  render () {

    return (
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <div>
              <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                  <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/app" component={App} />
                    <Route path="/settings" component={Settings} />
                  </Switch>
                  <MessageBar />
                </div>
              </MuiThemeProvider>
            </div>
          </ConnectedRouter>
        </Provider>
    )
  }
}

export default Root