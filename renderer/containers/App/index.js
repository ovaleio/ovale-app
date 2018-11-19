import React from 'react'
import { connect } from 'react-redux'

import Container  from '../../components/system/GridLayout/Container';


// CheckLicence

import Checklicence from '../../components/system/CheckLicence'
import TickerInfo from '../../components/core/TickerInfo/TickerInfo'

/*
import Tickers from '../../components/core/Tickers'
import TickerChart from '../../components/core/TickerChart'
import NewOrderForm from '../../components/core/NewOrderForm'
import Balances from '../../components/Balances'
import Orders from '../../components/core/Orders'
import Trades from '../../components/core/Trades'
*/

import { mapStateToProps } from '../../selectors/common'
import './style.css'

class App extends React.Component { 
 
  render () {
  
    return (
      <div>
        <Checklicence />
        <TickerInfo />
        <Container />
      </div>
    )
  }
}
/*

 <Checklicence />
        <div id="leftColumn" className="col-xs-3 col-sm-2">
          <Tickers />
        </div>
        <div id="mainColumn" className="col-xs-9 col-sm-10">
          <div className="row" id="tickerContainer">
            <TickerChart></TickerChart>
            <div id="tickerCol">
              <TickerInfo></TickerInfo>
              <NewOrderForm></NewOrderForm>
            </div>
          </div>
          <div id="userContainer" className="row">
            {OrdersOrTabs}
            <Balances />
          </div>
        </div>*/
export default connect(mapStateToProps)(App)