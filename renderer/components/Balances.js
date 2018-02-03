import react from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import { mapStateToProps } from '../selectors/balances'
import { setCurrentTicker, requestBalances, setSortBalances} from '../actions/actions'
import styles from '../styles/Balances'
import IconButton from 'material-ui/IconButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import * as ExchangesIcons from './ExchangesIcons'

class Balances extends react.Component {
  componentDidMount() {
    ipcRenderer.send('REQUEST_DATA', 'BALANCES')
  }

  render () {
    var {balances, total, baseCurrency, dispatch} = this.props;

    const rows = balances.map((balance, i) => {
      return (
        <tr key={i} style={Object.assign(styles.alternateRow(i),styles.tr)}>
          <td onClick={() => dispatch(setCurrentTicker({symbol: balance.symbol})) } style={{textAlign: 'center'}}>
            {ExchangesIcons[`${balance.exchange}Icon`]({viewBox: '0 0 124 124', style: styles.logoExchange})}
          </td>
          <td onClick={() => dispatch(setCurrentTicker({symbol: balance.symbol})) } style={styles.currency}>
            {balance.currency}
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
      <div className="col-xs-6 col-xl-5" style={{overflowX: 'hidden', overflowY: 'scroll', borderLeft: '1px solid rgba(0,0,0, 0.7)', padding: 0}}>
        <div style={styles.categoryHeader} className="row">
          <div className="col-xs-8">Balances</div>
          <div className="col-xs-3">Total: {total.toFixed(2)} BTC</div>
          <div className="col-xs-1" onClick={() => dispatch(requestBalances())}>
            <IconButton tooltip='Refresh' style={{width: '20px', height: '20px', margin: 0, padding: 0, border: 0}} iconStyle={{width: '20px', height: '20px', color: 'white'}}><NavigationRefresh /></IconButton>
          </div>
        </div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th onClick={() => dispatch(setSortBalances({sortKey: 'exchange'})) }></th>
              <th onClick={() => dispatch(setSortBalances({sortKey: 'currency'})) }>Currency</th>
              <th onClick={() => dispatch(setSortBalances({sortKey: 'balance'})) }>Amount</th>
              <th onClick={() => dispatch(setSortBalances({sortKey: 'available'})) }>(Available)</th>
              <th onClick={() => dispatch(setSortBalances({sortKey: 'price'})) }>Price</th>
              <th onClick={() => dispatch(setSortBalances({sortKey: 'totalValue'})) }>Total Value</th>
              <th onClick={() => dispatch(setSortBalances({sortKey: 'share'})) }>Share</th>
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