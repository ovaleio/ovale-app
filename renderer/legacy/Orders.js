import react from 'react'
import ReactDom from 'react-dom';
import {format, clients} from 'cryptoclients'
import Moment from 'react-moment'
// import { red, teal } from 'material-ui/styles/colors';


const styles = {
  table: {
    width: "100%",
    fontFamily: 'Lato',
    fontSize: '13px',
  },
  tr: {
    padding: "5px 5px",
    cursor: "pointer"
  },
  tHead: {
    backgroundColor: "rgba(0,0,0,0.15)"
  },
  categoryHeader: {
    padding: "2px 5px",
    lineHeight: "26px",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    fontSize: "14px",
    fontHeight: "bold",
    color: "#72EAD6"
  },
  categoryHeaderTab: {
    cursor: 'pointer'
  },
  categoryHeaderTabInactive: {
    cursor: 'pointer',
    color: '#FFF'
  },
  cancelButton: {
    cursor: "pointer",
    width: "100%",
    height: "100%",
    backgroundColor: "#ce3a00",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    fontSize: "11px",
    border: "none",
    color: "white",
    opacity: 0.80,
    borderRadius: 0
  },
  alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}},
  bgPercent: (n) => {
    var s = {};
    // if (n) {
    //   var x = Math.round(Math.abs(n) % 100 / 10) * 100;
    //   console.log(x);
    //   s.backgroundColor = red[x];
    // }
    return s;
  }
};

class Orders extends react.Component {

  constructor(props) {
    super(props);
  }

  handleClick (symbol) {
    this.props.onClickTicker(symbol);
  }

  render () {
    const { orders, onCancelOrder, onSwitch , onSort} = this.props

    const rows = orders.map((order, i) => {
      if (order === null) return;
      return (
        <tr key={i} style={Object.assign(styles.alternateRow(i),styles.tr)}>
          <td onClick={() => this.handleClick(order.symbol)}>{order.pair}</td>
          <td>{order.type}</td>
          <td><Moment fromNow>{order.date}</Moment></td>
          <td>{order.amount}</td>
          <td><strong>{order.rate}</strong></td>
          <td>{order.exchange}</td>
          <td>{order.price}</td>
          <td style={styles.bgPercent(order.deltaPercent)}>{order.deltaPercent} %</td>
          <td><button onClick={() => {onCancelOrder(order)}} style={styles.cancelButton}>cancel</button></td>
        </tr>
      )
    }, this);

    return (
      <div className="col-xs-6 col-lg-7">
        <div style={styles.categoryHeader} className="row">
          <div className="col-xs-2" style={styles.categoryHeaderTab}>Orders</div>
          <div className="col-xs-2" style={styles.categoryHeaderTabInactive} onClick={onSwitch}>Trades</div>
        </div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th onClick={() => {onSort('orders', 'pair')}}>Pair</th>
              <th onClick={() => {onSort('orders', 'type')}}>Type</th>
              <th onClick={() => {onSort('orders', 'date')}}>Date</th>
              <th onClick={() => {onSort('orders', 'amount')}}>Amount</th>
              <th onClick={() => {onSort('orders', 'rate')}}>Rate</th>
              <th onClick={() => {onSort('orders', 'exchange')}}>Exchange</th>
              <th onClick={() => {onSort('orders', 'price')}}>Last Price</th>
              <th onClick={() => {onSort('orders', 'deltaPercent')}}>To Go %</th>
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

export default Orders