import react from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/orders'
import { switchTab } from '../actions/common'
import { cancelOrder, setSort} from '../actions/orders'
import { setCurrentTicker } from '../actions/ticker' 
import Moment from 'react-moment'
import styles from '../styles/Orders'

class Orders extends react.Component {
  render () {
    const { orders, dispatch} = this.props

    const rows = orders.map((order, i) => {
      return (
        <tr key={i} style={Object.assign(styles.alternateRow(i),styles.tr)}>
          <td onClick={() => dispatch(setCurrentTicker({symbol: order.symbol})) }>{order.pair}</td>
          <td>{order.type}</td>
          <td><Moment fromNow>{order.date}</Moment></td>
          <td>{order.amount}</td>
          <td><strong>{order.rate}</strong></td>
          <td>{order.exchange}</td>
          <td>{order.price}</td>
          <td>{(order.deltaPercent * 100).toFixed(2)} %</td>
          <td><button onClick={() => dispatch(cancelOrder({order: order})) } style={styles.cancelButton}>cancel</button></td>
        </tr>
      )
    }, this);

    return (
      <div className="col-xs-6 col-lg-7">
        <div style={styles.categoryHeader} className="row">
          <div className="col-xs-2" style={styles.categoryHeaderTab}>Orders</div>
          <div className="col-xs-2" style={styles.categoryHeaderTabInactive} onClick={() => dispatch(switchTab({tab: 'Trades'})) }>Trades</div>
        </div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th onClick={() => dispatch(setSort({sortKey: 'pair'})) }>Pair</th>
              <th onClick={() => dispatch(setSort({sortKey: 'type'})) }>Type</th>
              <th onClick={() => dispatch(setSort({sortKey: 'balance'})) }>Date</th>
              <th onClick={() => dispatch(setSort({sortKey: 'amount'})) }>Amount</th>
              <th onClick={() => dispatch(setSort({sortKey: 'rate'})) }>Rate</th>
              <th onClick={() => dispatch(setSort({sortKey: 'exchange'})) }>Exchange</th>
              <th onClick={() => dispatch(setSort({sortKey: 'price'})) }>Last Price</th>
              <th onClick={() => dispatch(setSort({sortKey: 'deltaPercent'})) }>To Go %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Orders);