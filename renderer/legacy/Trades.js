import react from 'react'
import Moment from 'react-moment'

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
  alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}}
};

class Trades extends react.Component {

  constructor(props) {
    super(props);
  }

  handleClick (symbol) {
    this.props.onClickTicker(symbol);
  }

  render () {
    const { trades, onSwitch} = this.props

    const rows = trades.map((trade, i) => {
      return (
        <tr key={i} style={Object.assign(styles.alternateRow(i),styles.tr)}>
          <td onClick={() => this.handleClick(trade.symbol)}>{trade.pair}</td>
          <td>{trade.type}</td>
          <td><Moment format="DD-MM-YYYY">{trade.date}</Moment></td>
          <td>{trade.amount}</td>
          <td><strong>{trade.rate}</strong></td>
          <td>{trade.total.toPrecision(4)}</td>
          <td>{trade.exchange}</td>
        </tr>
      )
    }, this);

    return (
      <div className="col-xs-6 col-lg-7">
        <div style={styles.categoryHeader} className="row">
          <div className="col-xs-2" style={styles.categoryHeaderTabInactive} onClick={onSwitch}>Orders</div>
          <div className="col-xs-2" style={styles.categoryHeaderTab}>Trades</div>
        </div>
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th>Pair</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Rate</th>
              <th>Total</th>
              <th>Exchange</th>
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

export default Trades
