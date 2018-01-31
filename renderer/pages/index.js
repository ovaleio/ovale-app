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

const muiTheme = getMuiTheme({ userAgent: 'all', fontFamily: 'Lato, Helvetica, sans-serif'});
const store = initStore();

class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <style global jsx>
              {`
                /* latin-ext */
                @font-face {
                  font-family: 'Lato';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Lato Regular'), local('Lato-Regular'), url(/static/lato_latin_ext.woff2) format('woff2');
                  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
                }
                /* latin */
                @font-face {
                  font-family: 'Lato';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Lato Regular'), local('Lato-Regular'), url(/static/lato_latin.woff2) format('woff2');
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
                }

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
                .rowHover:hover {
                  backgroundColor: rgba(0,0,0,1)
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