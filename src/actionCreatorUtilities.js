export const bindIndexToActionCreator = (actionCreator, index) => {
  return (...args) => {
    return Object.assign(actionCreator(...args), { index })
  }
}
