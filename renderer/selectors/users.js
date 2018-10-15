import { createSelector } from 'reselect'

export const mapStateToProps = (state) => {
	return {
		email: state.userReducer.email,
	}
}