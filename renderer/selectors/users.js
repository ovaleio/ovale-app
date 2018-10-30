import { createSelector } from 'reselect'

export const mapStateToProps = (state) => {
	return {
		message: state.userReducer.message,
		user: state.userReducer.user,
		userSettings: state.settingsReducer.user,
		step: state.userReducer.step,
		jwt: state.userReducer.jwt
	}
}