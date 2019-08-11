import React, { Component } from "react"
import { connect } from "react-redux"

import {
  bindIndexToActionCreator,
  bindItemToNotesActionCreator
} from "./actionCreatorUtilities"
import Point, { pointActionCreators } from "./Point"
import { noteActionCreators } from "./Notes"
import { selectedActionCreator } from "./selected"

const pointDispatchProperties = index => dispatch => ({
  setPosition: (x, y) => {
    dispatch(
      bindIndexToActionCreator(pointActionCreators.setPosition, index)(x, y)
    )
  },
  setNotesPosition: (x, y) => {
    dispatch(
      bindItemToNotesActionCreator(
        noteActionCreators.setPosition,
        "POINT",
        index
      )(x, y)
    )
  },
  setNotesTethered: tethered => {
    dispatch(
      bindItemToNotesActionCreator(
        noteActionCreators.setTethered,
        "POINT",
        index
      )(tethered)
    )
  },
  setSelected: () => {
    dispatch(selectedActionCreator("POINT", index))
  }
})

class PointManager extends Component {
  render() {
    const { points } = this.props
    return (
      <React.Fragment>
        {points.map((point, i) => {
          return (
            <Point
              pointModel={point}
              selected={
                this.props.selected &&
                this.props.selected.itemType === "POINT" &&
                this.props.selected.index === i
              }
              {...pointDispatchProperties(i)(this.props.dispatch)}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    points: state.points,
    selected: state.selected
  }
}

export default connect(mapStateToProps)(PointManager)
