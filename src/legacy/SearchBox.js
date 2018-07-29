import react from 'react'

const styles = {
  form: {
    padding: "10px",
    height: "5vh"
  },
  input: {
    lineHeight: "26px",
    fontSize: "13px",
    width: "100%",
    border: "none",
    borderBottom: "1px solid #D2E4E1",
    background: "transparent",
    color: "white"
  }
}

class SearchBox extends react.Component {

  //inherits searchQuery and onChange method from main.js
  constructor(props) {
    super(props)
  }

  handleChange (e) {
    return this.props.onChange(e);
  }

  render () {
    return (
      <form style={styles.form}>
        <input
          id="searchBox"
          value={this.props.searchQuery}
          name="searchQuery"
          autoComplete="off"
          type="text"
          placeholder="Search"
          onChange={this.handleChange.bind(this)}
          style={styles.input}
        />
      </form>
    )
  }
}

export default SearchBox;
