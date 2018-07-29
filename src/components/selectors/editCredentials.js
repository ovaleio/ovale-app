//react-router passes data in component props through { match }
export const mapStateToProps = (state, {match}) => {
	const exchange = match.params.exchange;

	return {
		exchange: exchange,
		credentials: state.settingsReducer.credentials[exchange]
	}
}
