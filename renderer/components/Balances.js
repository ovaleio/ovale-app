import react from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/balances'
import { fetchBalances, setSort} from '../actions/balances'
import { setCurrentTicker } from '../actions/ticker' 
import styles from '../styles/Balances'

class Balances extends react.Component {
  render () {
    var {balances, total, baseCurrency, dispatch} = this.props;

    const rows = balances.map((balance, i) => {
      return (
        <tr key={i} style={Object.assign(styles.alternateRow(i),styles.tr)}>
          <td onClick={() => dispatch(setCurrentTicker({symbol: balance.symbol})) }>
            {balance.currency}
          </td>
          <td>
            {balance.exchange}
          </td>
          <td>{balance.balance.toFixed(2)}</td>
          <td>{balance.available.toFixed(2)}</td>
          <td>{balance.price.toPrecision(4)}</td>
          <td>{balance.totalValue.toPrecision(4)} {baseCurrency}</td>
          <td>{(balance.share * 100).toFixed(2)} %</td>
        </tr>
      )
    })

    return (
      <div className="col-xs-6 col-lg-5">
        <div style={styles.categoryHeader} className="row">
          <div className="col-xs-8">Balances</div>
          <div className="col-xs-4">Total: {total.toFixed(4)} BTC</div>
        </div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th onClick={() => dispatch(setSort({sortKey: 'currency'})) }>Currency</th>
              <th onClick={() => dispatch(setSort({sortKey: 'exchange'})) }>Exchange</th>
              <th onClick={() => dispatch(setSort({sortKey: 'balance'})) }>Amount</th>
              <th onClick={() => dispatch(setSort({sortKey: 'available'})) }>(Available)</th>
              <th onClick={() => dispatch(setSort({sortKey: 'price'})) }>Price</th>
              <th onClick={() => dispatch(setSort({sortKey: 'totalValue'})) }>Total Value</th>
              <th onClick={() => dispatch(setSort({sortKey: 'share'})) }>Share</th>
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

export default connect(mapStateToProps)(Balances);