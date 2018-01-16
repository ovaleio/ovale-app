import React from 'react'
import Tickers from '../components/Tickers'
import TickerInfo from '../components/TickerInfo'
import TickerChart from '../components/TickerChart'
import NewOrderForm from '../components/NewOrderForm'
import Balances from '../components/Balances'
import Orders from '../components/Orders'
import Trades from '../components/Trades'
import Snackbar from 'material-ui/Snackbar'

import withRedux from 'next-redux-wrapper'
import initStore from '../initStore'
import { closeSnackbar } from '../actions/actions'
import { mapStateToProps } from '../selectors/common'

import flexbox from '../static/flexbox.css'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styles from '../styles/Main'

const muiTheme = getMuiTheme({ userAgent: 'all'});

class Main extends React.Component {

  render () {
    const { currentTab, showSnackbar, message, dispatch} = this.props;

    const OrdersOrTabs = currentTab === 'Orders' ? (<Orders />) : (<Trades />)

    return (
      <div>
        <style global jsx>
          {`
            body, div, p {
              margin: 0;
              padding: 0
            }
            table {
                border-collapse: collapse;
            }
            input:focus, select:focus, textarea:focus,button:focus {
              outline: "none"
            }
            ::selection { background: white; /* WebKit/Blink Browsers */ }
          `}
        </style>
        <style global jsx>
          {flexbox}
        </style>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.main}>
            <div id="leftColumn" style={styles.leftColumn} className="col-xs-3 col-sm-2">
              <Tickers />
            </div>
            <div id="mainColumn" className="col-xs-9 col-sm-10">
              <div style={styles.tickerContainer} className="row">
                <TickerChart></TickerChart>
                <div style={styles.tickerCol}>
                  <TickerInfo></TickerInfo>
                  <NewOrderForm></NewOrderForm>
                </div>
              </div>
              <div id="userData" style={styles.userDataContainer} className="row">
                {OrdersOrTabs}
                <Balances />
              </div>
            </div>
            <Snackbar
              open={showSnackbar}
              message={message}
              onRequestClose={() => dispatch(closeSnackbar())}
              autoHideDuration={2000}
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default withRedux(initStore, mapStateToProps)(Main)