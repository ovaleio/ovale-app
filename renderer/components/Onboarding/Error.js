import React from 'react';
import "./css/error.css";

class Error extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="error">
         {this.props.errors.map(error => (
           <div>Error: {error}</div>
         ))}   
      </div>
    )
  }
}


export default Error