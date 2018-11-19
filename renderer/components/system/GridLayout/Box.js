import React, { Component } from 'react'


export default class Box extends Component {
  constructor(props){
    super(props);

  }
  componentDidMount() {
    console.log(this.props)
  }
  render() {
    return (
        <div>

        </div>
    )
  }
}
