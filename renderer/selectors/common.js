import { createSelector } from 'reselect'

export const baseCurrencySelector = state => state.commonReducer.baseCurrency
export const socketSelector = state => state.commonReducer.socket

export const mapStateToProps = (state) => {
  return state.commonReducer
}