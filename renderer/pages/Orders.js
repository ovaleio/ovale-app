import react from 'react'
import ReactDom from 'react-dom';
import format from '../format.js';

const styles = {
  propTicker: {
    "color": "#fff",
    "width": "100px"
  },
  tr: {
    fontWeight: "bold"
  }
};

class Orders extends react.Component {

  constructor(props) {
    super(props);
  }

  cleanOrders () {
    const { orders, tickers, baseCurrency } = this.props

    orders.map((order, i) => {
      if (!order) return;

      var symbol = order.exchange + ':' + order.pair;
      var lastPrice = tickers ? tickers[symbol] : 0;

      if (typeof lastPrice == 'number' && lastPrice > 0) {
        order.lastPrice = lastPrice.toPrecision(4);
        order.togo = ((order.rate/lastPrice - 1) * 100).toPrecision(4);
      }
    });

    return orders;
  }

  handleClick (symbol) {
    this.props.onClickTicker(symbol);
  }

  render () {
    const { orders, onCancelOrder, onClickTicker } = this.props

    var cleanedOrders = this.cleanOrders();

    const rows = cleanedOrders.map((order, i) => {
      return (
        <tr key={i}>
          <td onClick={() => this.handleClick(order.symbol)}>{order.pair}</td>
          <td>{order.type}</td>
          <td>{order.amount}</td>
          <td><strong>{order.rate}</strong></td>
          <td>{order.exchange}</td>
          <td>{order.lastPrice}</td>
          <td>{order.togo} %</td>
          <td><button onClick={() => {onCancelOrder(order)}}>cancel</button></td>
        </tr>
      )
    }, this);

    return (
        <table className="col-xs-6">
          <thead>
            <tr>
              <th>Pair</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Rate</th>
              <th>Exchange</th>
              <th>Last Price</th>
              <th>To Go %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
    );
  }
}

export default Orders