import React from 'react'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux';

import flexbox from '../static/flexbox.css'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from '../components/App'
import Settings from '../components/Settings'
import MessageBar from '../components/MessageBar'

import initStore from '../initStore'
import history from '../history';

const muiTheme = getMuiTheme({ userAgent: 'all'});
const store = initStore();

class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <style global jsx>
              {`
                body, div, p {
                  margin: 0;
                  padding: 0;
                }
                table {
                    border-collapse: collapse;
                }
                input:focus, select:focus, textarea:focus,button:focus {
                  outline: none
                },
                .rowHover {
                  backgroundColor: rgba(0,0,0,0.7)
                },
                ::selection { background: white; /* WebKit/Blink Browsers */ }
              `}
            </style>
            <style global jsx>
              {flexbox}
            </style>
            <MuiThemeProvider muiTheme={muiTheme}>
              <div>
                <Switch>
                  <Route exact path="/" component={App} />
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