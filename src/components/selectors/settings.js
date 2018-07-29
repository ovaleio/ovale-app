export const mapStateToProps = (state) => {
	return {
		exchanges: state.settingsReducer.supportedExchanges
	}
}
