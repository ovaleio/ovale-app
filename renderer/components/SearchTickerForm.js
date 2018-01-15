import react from 'react'
import styles from '../styles/SearchTickerForm'

class SearchTickerForm extends react.Component {
  render () {
	  const { onChange } = this.props
	  return (
		<form style={styles.form}>
	        <input
	          name="searchQuery"
	          autoComplete="off" 
	          type="text"
	          onChange={onChange}
	          placeholder="Search"
	          style={styles.input}
	        />
		</form>
	  )
  }
}

export default SearchTickerForm