import React from 'react'
import { connect } from 'react-redux'

import Tickers from '../components/Tickers'
import TickerInfo from '../components/TickerInfo'
import TickerChart from '../components/TickerChart'
import NewOrderForm from '../components/NewOrderForm'
import Balances from '../components/Balances'
import Orders from '../components/Orders'
import Trades from '../components/Trades'
import Snackbar from 'material-ui/Snackbar'

import { closeSnackbar } from '../actions/actions'
import { mapStateToProps } from '../selectors/common'
import styles from '../styles/Main'

class App extends React.Component {

  render () {
    const { currentTab, showSnackbar, message, style, dispatch} = this.props;
    
    const OrdersOrTabs = currentTab === 'Orders' ? (<Orders />) : (<Trades />)

    return (
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
          contentStyle={style}
          onRequestClose={() => dispatch(closeSnackbar())}
          autoHideDuration={style.color === 'red' ? 4800 : 1500}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(App)