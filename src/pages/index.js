import React from 'react'
import { ipcRenderer } from 'electron'
import {
  Route,
  Switch,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux';
import Head from 'next/head'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from '../components/App'
import Settings from '../components/Settings'
import MessageBar from '../components/MessageBar'

import initStore from '../initStore'
import history from '../history';
import { init as websocketInit } from '../websocket'

const muiTheme = getMuiTheme({ userAgent: 'all', fontFamily: 'Lato, Helvetica, sans-serif'});
const store = initStore();
websocketInit(store);

class Root extends React.Component {
  componentDidMount() {
    ipcRenderer.send('OPENED_MAIN_WINDOW')
  }

  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Head>
              <title>OVALE</title>
            </Head>
            <style global jsx>
              {`
                .container,.container-fluid{margin-right:auto;margin-left:auto}.container-fluid{padding-right:2rem;padding-left:2rem}.row{box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-.5rem;margin-left:-.5rem}.row.reverse{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.col.reverse{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.col-xs,.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9,.col-xs-offset-0,.col-xs-offset-1,.col-xs-offset-10,.col-xs-offset-11,.col-xs-offset-12,.col-xs-offset-2,.col-xs-offset-3,.col-xs-offset-4,.col-xs-offset-5,.col-xs-offset-6,.col-xs-offset-7,.col-xs-offset-8,.col-xs-offset-9{box-sizing:border-box;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-xs{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-xs-1{-ms-flex-preferred-size:8.33333333%;flex-basis:8.33333333%;max-width:8.33333333%}.col-xs-2{-ms-flex-preferred-size:16.66666667%;flex-basis:16.66666667%;max-width:16.66666667%}.col-xs-3{-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-xs-4{-ms-flex-preferred-size:33.33333333%;flex-basis:33.33333333%;max-width:33.33333333%}.col-xs-5{-ms-flex-preferred-size:41.66666667%;flex-basis:41.66666667%;max-width:41.66666667%}.col-xs-6{-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-xs-7{-ms-flex-preferred-size:58.33333333%;flex-basis:58.33333333%;max-width:58.33333333%}.col-xs-8{-ms-flex-preferred-size:66.66666667%;flex-basis:66.66666667%;max-width:66.66666667%}.col-xs-9{-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-xs-10{-ms-flex-preferred-size:83.33333333%;flex-basis:83.33333333%;max-width:83.33333333%}.col-xs-11{-ms-flex-preferred-size:91.66666667%;flex-basis:91.66666667%;max-width:91.66666667%}.col-xs-12{-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-xs-offset-0{margin-left:0}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-11{margin-left:91.66666667%}.start-xs{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-xs{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-xs{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-xs{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.middle-xs{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.bottom-xs{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.around-xs{-ms-flex-pack:distribute;justify-content:space-around}.between-xs{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.first-xs{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.last-xs{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}@media only screen and (min-width:48em){.container{width:49rem}.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-offset-0,.col-sm-offset-1,.col-sm-offset-10,.col-sm-offset-11,.col-sm-offset-12,.col-sm-offset-2,.col-sm-offset-3,.col-sm-offset-4,.col-sm-offset-5,.col-sm-offset-6,.col-sm-offset-7,.col-sm-offset-8,.col-sm-offset-9{box-sizing:border-box;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-sm{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-sm-1{-ms-flex-preferred-size:8.33333333%;flex-basis:8.33333333%;max-width:8.33333333%}.col-sm-2{-ms-flex-preferred-size:16.66666667%;flex-basis:16.66666667%;max-width:16.66666667%}.col-sm-3{-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-sm-4{-ms-flex-preferred-size:33.33333333%;flex-basis:33.33333333%;max-width:33.33333333%}.col-sm-5{-ms-flex-preferred-size:41.66666667%;flex-basis:41.66666667%;max-width:41.66666667%}.col-sm-6{-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-sm-7{-ms-flex-preferred-size:58.33333333%;flex-basis:58.33333333%;max-width:58.33333333%}.col-sm-8{-ms-flex-preferred-size:66.66666667%;flex-basis:66.66666667%;max-width:66.66666667%}.col-sm-9{-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-sm-10{-ms-flex-preferred-size:83.33333333%;flex-basis:83.33333333%;max-width:83.33333333%}.col-sm-11{-ms-flex-preferred-size:91.66666667%;flex-basis:91.66666667%;max-width:91.66666667%}.col-sm-12{-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-sm-offset-0{margin-left:0}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-11{margin-left:91.66666667%}.start-sm{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-sm{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-sm{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-sm{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.middle-sm{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.bottom-sm{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.around-sm{-ms-flex-pack:distribute;justify-content:space-around}.between-sm{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.first-sm{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.last-sm{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}}@media only screen and (min-width:64em){.container{width:65rem}.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-offset-0,.col-md-offset-1,.col-md-offset-10,.col-md-offset-11,.col-md-offset-12,.col-md-offset-2,.col-md-offset-3,.col-md-offset-4,.col-md-offset-5,.col-md-offset-6,.col-md-offset-7,.col-md-offset-8,.col-md-offset-9{box-sizing:border-box;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-md{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-md-1{-ms-flex-preferred-size:8.33333333%;flex-basis:8.33333333%;max-width:8.33333333%}.col-md-2{-ms-flex-preferred-size:16.66666667%;flex-basis:16.66666667%;max-width:16.66666667%}.col-md-3{-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-md-4{-ms-flex-preferred-size:33.33333333%;flex-basis:33.33333333%;max-width:33.33333333%}.col-md-5{-ms-flex-preferred-size:41.66666667%;flex-basis:41.66666667%;max-width:41.66666667%}.col-md-6{-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-md-7{-ms-flex-preferred-size:58.33333333%;flex-basis:58.33333333%;max-width:58.33333333%}.col-md-8{-ms-flex-preferred-size:66.66666667%;flex-basis:66.66666667%;max-width:66.66666667%}.col-md-9{-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-md-10{-ms-flex-preferred-size:83.33333333%;flex-basis:83.33333333%;max-width:83.33333333%}.col-md-11{-ms-flex-preferred-size:91.66666667%;flex-basis:91.66666667%;max-width:91.66666667%}.col-md-12{-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-md-offset-0{margin-left:0}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-3{margin-left:25%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-6{margin-left:50%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-9{margin-left:75%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-11{margin-left:91.66666667%}.start-md{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-md{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-md{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-md{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.middle-md{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.bottom-md{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.around-md{-ms-flex-pack:distribute;justify-content:space-around}.between-md{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.first-md{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.last-md{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}}@media only screen and (min-width:75em){.container{width:76rem}.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-offset-0,.col-lg-offset-1,.col-lg-offset-10,.col-lg-offset-11,.col-lg-offset-12,.col-lg-offset-2,.col-lg-offset-3,.col-lg-offset-4,.col-lg-offset-5,.col-lg-offset-6,.col-lg-offset-7,.col-lg-offset-8,.col-lg-offset-9{box-sizing:border-box;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-lg{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-lg-1{-ms-flex-preferred-size:8.33333333%;flex-basis:8.33333333%;max-width:8.33333333%}.col-lg-2{-ms-flex-preferred-size:16.66666667%;flex-basis:16.66666667%;max-width:16.66666667%}.col-lg-3{-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-lg-4{-ms-flex-preferred-size:33.33333333%;flex-basis:33.33333333%;max-width:33.33333333%}.col-lg-5{-ms-flex-preferred-size:41.66666667%;flex-basis:41.66666667%;max-width:41.66666667%}.col-lg-6{-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-lg-7{-ms-flex-preferred-size:58.33333333%;flex-basis:58.33333333%;max-width:58.33333333%}.col-lg-8{-ms-flex-preferred-size:66.66666667%;flex-basis:66.66666667%;max-width:66.66666667%}.col-lg-9{-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-lg-10{-ms-flex-preferred-size:83.33333333%;flex-basis:83.33333333%;max-width:83.33333333%}.col-lg-11{-ms-flex-preferred-size:91.66666667%;flex-basis:91.66666667%;max-width:91.66666667%}.col-lg-12{-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-lg-offset-0{margin-left:0}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-11{margin-left:91.66666667%}.start-lg{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-lg{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-lg{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-lg{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.middle-lg{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.bottom-lg{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.around-lg{-ms-flex-pack:distribute;justify-content:space-around}.between-lg{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.first-lg{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.last-lg{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}}
              `}
            </style>
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