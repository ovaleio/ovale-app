import react from 'react'
import ReactDom from 'react-dom';
import {format} from 'cryptoclients';

const styles = {
  table: {
    width: "100%",
    fontFamily: 'Lato',
    fontSize: '13px',
  },
  tr: {
    padding: "5px 5px"
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
  alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}}
};

class Balances extends react.Component {

  constructor(props) {
    super(props);
  }

  handleClick (symbol) {
    this.props.onClickTicker(symbol);
  }

  render () {
    var {balances, total, baseCurrency, onSort} = this.props;

    const rows = balances.map((balance, i) => {
      if (!balance.totalValue) return;
      return (
        <tr key={i} style={Object.assign(styles.alternateRow(i),styles.tr)}>
          <td onClick={() => this.handleClick(balance.symbol)}>
            {balance.currency}
          </td>
          <td>
            <a href={balance.ticker.url} target="_blank">
              {balance.exchange}
            </a>
          </td>
          <td>{balance.balance.toFixed(2)}</td>
          <td>{balance.available.toFixed(2)}</td>
          <td>{balance.price.toPrecision(4)}</td>
          <td>{balance.totalValue[baseCurrency].toPrecision(2)} {baseCurrency}</td>
          <td>{(balance.share  * 100).toFixed(2)}%</td>
        </tr>
      )
    })

    return (
      <div className="col-xs-6 col-lg-5">
        <div style={styles.categoryHeader} className="row">
          <div className="col-xs-8">Balances</div>
          <div className="col-xs-4">Total: {total.BTC.toFixed(4)} BTC</div>
        </div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th onClick={() => {onSort('balances', 'currency')}}>Currency</th>
              <th onClick={() => {onSort('balances', 'exchange')}}>Exchange</th>
              <th onClick={() => {onSort('balances', 'balance')}}>Amount</th>
              <th onClick={() => {onSort('balances', 'available')}}>(Available)</th>
              <th onClick={() => {onSort('balances', 'price')}}>Price</th>
              <th onClick={() => {onSort('balances', 'totalValue.' + baseCurrency)}}>Total Value</th>
              <th onClick={() => {onSort('balances', 'share')}}>Share</th>
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

export default Balances