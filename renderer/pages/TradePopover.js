import react from 'react'
import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';

class TradePopover extends react.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      trades: {}
    };
  }

  getTradeData = (pair) => {
    fetch(`http://localhost:8080/trades/${pair}`)
    .then(trades => trades.json())
    .then(trades => {
      this.setState({ trades });
    })
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.getTradeData(`BTC-${this.props.label}`);

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  renderTradesSummary = () => {
    const { trades } = this.state;
    if (!trades || !trades.totalAmount) return (<div></div>);

    else return (
      <div>
        <p>You bought {trades.totalAmount.buy} {this.props.label} and sold {trades.totalAmount.sell} {this.props.label}</p>
        <p>Average Buy Price: {trades.averagePrice.buy}</p>
        <p>Average Sell Price: {trades.averagePrice.sell}</p>
      </div>
    )
  }

  render () {
    const { open, anchorEl} = this.state;
    return (<div>
      <FlatButton backgroundColor="#00BCD4" style={this.props.style} label={this.props.label} onClick={this.handleTouchTap} />
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.handleRequestClose}
      >
        {this.renderTradesSummary()}
      </Popover>
    </div>)
  }
}

export default TradePopover;