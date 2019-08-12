import React, { Component } from "react"
import { connect } from "react-redux"

import {
  bindIndexToActionCreator,
  bindItemToNotesActionCreator
} from "./actionCreatorUtilities"
import Ruler, { rulerActionCreators } from "./Ruler"
import { noteActionCreators } from './Notes'

const rulerDispatchProperties = index => dispatch => ({
  setPosition1: (x, y) => {
    dispatch(bindIndexToActionCreator(rulerActionCreators.setPosition, index)(0, x, y))
  },
  setPosition2: (x, y) => {
    dispatch(bindIndexToActionCreator(rulerActionCreators.setPosition, index)(1, x, y))
  },
  setNotesPosition1: (x, y) => {
    dispatch(
      bindItemToNotesActionCreator(
        noteActionCreators.setPosition,
        "RULER-1",
        index
      )(x, y)
    )
  },
  setNotesPosition2: (x, y) => {
    dispatch(
      bindItemToNotesActionCreator(
        noteActionCreators.setPosition,
        "RULER-2",
        index
      )(x, y)
    )
  },
  setNotesTethered1: tethered => {
    dispatch(bindItemToNotesActionCreator(noteActionCreators.setTethered, "RULER-1", index)(tethered))
  },
  setNotesTethered2: tethered => {
    dispatch(bindItemToNotesActionCreator(noteActionCreators.setTethered, "RULER-2", index)(tethered))
  }
})

class RulerManager extends Component {
  render() {
    const { rulers, selected, dispatch } = this.props

    return (
      <React.Fragment>
        {rulers.map((ruler, i) => (
          <Ruler
            rulerModel={ruler}
            selected={
              selected && selected.itemType === "RULER" && selected.index === i
            }
            {...rulerDispatchProperties(i)(dispatch)}
          />
        ))}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    rulers: state.rulers,
    selected: state.selected
  }
}

export default connect(mapStateToProps)(RulerManager)
