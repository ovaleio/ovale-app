import react from 'react'
import styles from './styleSearchTickerForm'

class SearchTickerForm extends react.Component {
  render () {
		const { onChange, onSubmit } = this.props
	  return (
		<div className="row">
			<div className="col-xs-12">
				<form style={styles.form}	onSubmit={onSubmit}>
					<input
						name="searchQuery"
						autoComplete="off" 
						type="text"
						onChange={onChange}
						placeholder="Search tickers"
						style={styles.input}
					/>
				</form>
			</div>
		</div>
		
	  )
  }
}

export default SearchTickerForm