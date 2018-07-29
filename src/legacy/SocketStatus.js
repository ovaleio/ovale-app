import react from 'react'

const style = {
	height: "5vh",
	backgroundColor: "rgba(0, 0, 0, 0.15)",
	boxShadow: "-1px -1px 2px 2px rgba(0, 0, 0, 0.35)",
  width: "100%"
}

class SocketStatus extends react.Component {

  //inherits status
  constructor(props) {
    super(props)
  }

  render () {
  	const {status} = this.props;
  	return (
  		<div style={style}>Status: {JSON.stringify(status)}</div>
  	)
  }
}

export default SocketStatus;
