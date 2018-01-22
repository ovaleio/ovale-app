import { createSelector } from 'reselect'

export const mapStateToProps = (state) => {
	console.log(state);
	return {
		exchanges: state.settingsReducer.supportedExchanges
	}
}