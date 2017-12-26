import react from 'react'
import ReactDom from 'react-dom';
import format from '../format.js';

const styles = {

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
      var btcTicker = 1;
    }
    else if (tickers && tickers[symbol]) {
      var btcTicker = tickers[symbol];
    }

    return btcTicker;
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
    let {balances, total} = this.cleanBalances();

    if (!balances.length) {
      return (<div>No balance</div>)
    }

    const rows = balances.map((balance, i) => {
      return (
        <tr key={i}>
          <td onClick={() => this.handleClick(balance.symbol)}>
            {balance.currency}
          </td>
          <td>
            <a href={balance.ticker.url} target="_blank">
              {balance.exchange}
            </a>
          </td>
          <td>{balance.balance}</td>
          <td><strong>{balance.ticker.rate}</strong></td>
          <td>{balance.ticker.totalValue.toFixed(4)}</td>
          <td>{(balance.ticker.share * 100).toFixed(2)} %</td>
        </tr>
      )
    })

    return (
      <table className="col-xs-6">
        <thead>
          <tr>
            <th>Currenc.</th>
            <th>Exchange</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Total Value</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr style={{fontWeight: "bold"}}>
            <td>Total</td>
            <td>{total.btc.toFixed(4)} BTC</td>
            <td>{Math.round(total.usd)} USD</td>
            <td>1 BTC = {this.getUsdTicker()} USD</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Balances