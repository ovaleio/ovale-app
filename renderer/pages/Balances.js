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

  getUsdTicker (rounded) {
    const usdTicker = this.props.tickers ? this.props.tickers['bitfinex:USD-BTC'] || this.props.tickers['poloniex:USDT-BTC'] : 0;

    if (rounded) {
      return Math.round(usdTicker);
    }
    return usdTicker;
  }

  getBtcTicker (exchange, currency, baseCurrency) {
    const tickers = this.props.tickers;
    baseCurrency = baseCurrency || this.props.baseCurrency;

    var symbol = exchange + ':' + baseCurrency + '-' + currency;

    if (currency == baseCurrency) {
      return 1;
    }
    else if (tickers && tickers[symbol]) {
      return  tickers[symbol];
    }
    else {
      return 0;
    }
  }

  cleanBalances () {
    const { balances, baseCurrency } = this.props

    var total = {btc: 0, usd: 0};
    var cleanedBalances = balances.filter(balance => balance && balance.currency !== 'USD');

    cleanedBalances.forEach((balance) => {
      var rate = this.getBtcTicker(balance.exchange, balance.currency, baseCurrency)
      balance.ticker = {
        rate: rate,
        url: format[balance.exchange]? format[balance.exchange].to.url(`${baseCurrency}-${balance.currency}`): "#",
        totalValue: balance.balance * rate
      }

      total.btc += parseFloat(balance.ticker.totalValue)
    })

    total.usd = total.btc * this.getUsdTicker()

    cleanedBalances.forEach((balance) => {
        balance.ticker.share = balance.ticker.totalValue / total.btc
    });

    return {balances: cleanedBalances, total: total};
  }

  handleClick (symbol) {
    console.log(symbol);
    this.props.onClickTicker(symbol);
  }

  render () {
    var {balances, total} = this.cleanBalances();

    const rows = balances.map((balance, i) => {
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
          <td>{balance.balance.toPrecision(4)}</td>
          <td>{balance.available.toPrecision(4)}</td>
          <td><strong>{balance.ticker.rate}</strong></td>
          <td>{balance.ticker.totalValue.toFixed(4)}</td>
          <td>{(balance.ticker.share * 100).toFixed(2)} %</td>
        </tr>
      )
    })

    return (
      <div className="col-xs-6 col-lg-5">
        <div style={styles.categoryHeader} className="row">Balances</div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th>Currenc.</th>
              <th>Exchange</th>
              <th>Amount</th>
              <th>(Available)</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows}
            <tr style={{fontWeight: "bold"}}>
              <td>Total</td>
              <td>{total.btc.toFixed(2)} BTC</td>
              <td colSpan="2">{Math.round(total.usd)} USD</td>
              <td colSpan="2">1 BTC = {this.getUsdTicker()} USD</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Balances