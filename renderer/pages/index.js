import React from 'react'
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

import Drift from '../components/Drift';

import initStore from '../initStore'
import history from '../history';
import { init as websocketInit } from '../websocket'

import settings from 'electron-settings';

import jwt from "jsonwebtoken"

// CSS
import "../styles/css/flexboxgrid.css";
import "../styles/css/global.css";
import "../styles/css/fonts.css";

const muiTheme = getMuiTheme({ userAgent: 'all', fontFamily: 'Lato, Helvetica, sans-serif'});
const store = initStore();
websocketInit(store);

  // First Landing
  if(settings.get('jwt') === null) {
    console.log("No JWT");
    store.dispatch(push('/onboarding'));
  }
  if(jwt.decode(settings.get('jwt'))) {
    console.log("JWT found : ");
    store.dispatch(push('/'));
  }
class Root extends React.Component {

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
                  <Route exact path="/" component={App} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/onboarding" component={Onboarding} />
                </Switch>
                <MessageBar />
                <Drift appId="i5mesw6sgieb" />
              </div>
            </MuiThemeProvider>
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root