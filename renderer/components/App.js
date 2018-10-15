import React from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import Tickers from '../components/Tickers'
import TickerInfo from '../components/TickerInfo'
import TickerChart from '../components/TickerChart'
import NewOrderForm from '../components/NewOrderForm'
import Balances from '../components/Balances'
import Orders from '../components/Orders'
import Trades from '../components/Trades'

import { mapStateToProps } from '../selectors/common'
import styles from '../styles/Main'

class App extends React.Component {

  componentDidMount(){
    // Send to main the OPENED MAIN WINDOW event
    ipcRenderer.send('OPENED_MAIN_WINDOW');
  }

  render () {
    const { currentTab, dispatch} = this.props;
    
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
          <div style={styles.userDataContainer} className="row">
            {OrdersOrTabs}
            <Balances />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(App)