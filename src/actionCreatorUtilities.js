export const bindIndexToActionCreator = (actionCreator, index) => {
  return (...args) => {
    return Object.assign(actionCreator(...args), { index })
  }
}

export const bindItemToNotesActionCreator = (
  notesActionCreator,
  parentType,
  index
) => {
  return (...args) => {
    return Object.assign(notesActionCreator(...args), {
      index,
      parentType
    })
  }
}
