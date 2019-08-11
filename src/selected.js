export const selectedAction = "SELECTED"

export const selectedActionCreator = (itemType, index) => {
  return {
    type: selectedAction,
    itemType,
    index
  }
}
