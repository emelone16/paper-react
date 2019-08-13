import React, { Component } from "react"
import { connect } from "react-redux"

import {
  bindIndexToActionCreator,
  bindItemToNotesActionCreator
} from "./actionCreatorUtilities"
import Ruler, { rulerActionCreators } from "./Ruler"
import { noteActionCreators } from './Notes'

const rulerDispatchProperties = index => dispatch => ({
  setPosition: (i, x, y) => {
    dispatch(bindIndexToActionCreator(rulerActionCreators.setPosition, index)(i, x, y))
  },
  setNotesPosition: (i, x, y) => {
    dispatch(
      {...bindItemToNotesActionCreator(
        noteActionCreators.setPosition,
        "RULER",
        index
      )(x, y), rulerIndex: i}
    )
  },
  setNotesTethered: (i, tethered) => {
    dispatch({...bindItemToNotesActionCreator(noteActionCreators.setTethered, "RULER", index)(tethered), rulerIndex: i})
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
