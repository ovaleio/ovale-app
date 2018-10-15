import React from 'react';
import "./css/error.css";

class Error extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
  }

  render() {

    return (
      <ul className="error">
         {this.props.errors.map(error => (
            <li key={error}>Error: {error}</li>
         ))}   
      </ul>
    )
  }
}


export default Error