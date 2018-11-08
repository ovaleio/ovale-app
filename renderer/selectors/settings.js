import { createSelector } from 'reselect'

export const mapStateToProps = (state) => {
	return {
		exchanges: state.settingsReducer.supportedExchanges,
		jwt: state.settingsReducer.user.jwt,
		email: state.settingsReducer.user.email,
		user: state.settingsReducer.user
	}
}