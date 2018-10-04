import { createSelector } from 'reselect'

export const mapStateToProps = (state) => {
	return {
		exchanges: state.settingsReducer.supportedExchanges,
		jwt: state.settingsReducer.jwt
	}
}