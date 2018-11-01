import react from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/orders'
import { switchTab, cancelOrder, setSortOrders, setCurrentTicker, requestOrders } from '../actions/actions'
import Moment from 'react-moment'
import styles from '../styles/Orders'
import IconButton from 'material-ui/IconButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import ReactInterval from 'react-interval'
import * as ExchangesIcons from './ExchangesIcons'

class Orders extends react.Component {
  componentDidMount() {
    ipcRenderer.send('REQUEST_DATA', 'ORDERS')
  }

  render () {
    const { orders, dispatch, delay} = this.props

    const rows = orders.map((order, i) => {
      return (
        <tr key={i} onClick={() => dispatch(setCurrentTicker({symbol: order.symbol}))} className="row-even cursor-pointer">
          <td style={{textAlign: 'center'}}>
            {ExchangesIcons[`${order.exchange}Icon`]({viewBox: '0 0 128 128', style: styles.logoExchange})}
          </td>
          <td style={styles.symbol}>
            {order.pair}
          </td>
          <td>
            <IconButton tooltip={order.type} style={styles[order.type + 'Type']}></IconButton>
          </td>
          <td>{order.amount}</td>
          <td><strong>{order.rate}</strong></td>
          <td>{order.price}</td>
          <td>{(order.deltaPercent * 100).toFixed(0)} %</td>
          <td><Moment format="YYYY/MM/DD">{order.date}</Moment></td>
          <td><button onClick={() => dispatch(cancelOrder({order: order})) } style={styles.cancelButton}>cancel</button></td>
        </tr>
      )
    }, this);

    return (
      <div className="col-xs-6 col-xl-7" style={{overflowX: 'hidden', overflowY: 'scroll', padding: 0}}>
        <div style={styles.categoryHeader} className="row">
          <div className="col-xs-2 widget-title" style={styles.categoryHeaderTab}>Orders</div>
          <div className="col-xs-2 widget-title" style={styles.categoryHeaderTabInactive} onClick={() => dispatch(switchTab({tab: 'Trades'})) }>Trades</div>
          <div className="col-xs-offset-7 col-xs-1" onClick={() => dispatch(requestOrders())}>
            <IconButton tooltip='Refresh' style={{width: '20px', height: '20px', margin: 0, padding: 0, border: 0}} iconStyle={{width: '20px', height: '20px', color: 'white'}}><NavigationRefresh /></IconButton>
          </div>
        </div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'exchange'})) }></th>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'pair'})) }>Pair</th>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'type'})) }>Type</th>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'amount'})) }>Amount</th>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'rate'})) }>Rate</th>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'price'})) }>Last Price</th>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'deltaPercent'})) }>Delta</th>
              <th onClick={() => dispatch(setSortOrders({sortKey: 'date'})) }>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows : (<tr><td colSpan="9" style={{textAlign: 'center'}}>No order to show</td></tr>)}
          </tbody>
        </table>
        <ReactInterval timeout={delay} enabled={true}
          callback={() => ipcRenderer.send('REQUEST_DATA', 'ORDERS')} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Orders);