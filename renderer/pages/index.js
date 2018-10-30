import React from 'react'
import {ipcRenderer} from 'electron'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter, push } from 'react-router-redux';
import Head from 'next/head'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from '../components/App'
import Settings from '../components/Settings'
import Onboarding from '../components/Onboarding/Onboarding.js'
import MessageBar from '../components/MessageBar'

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

  componentDidMount() {
    ipcRenderer.send('REQUEST_USER')
  }

  render () {

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Head>
              <title>OVALE</title>
            </Head>
            <MuiThemeProvider muiTheme={muiTheme}>
              <div>
                <Switch>
                  <Route exact path="/" component={Onboarding} />
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