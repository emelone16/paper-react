import React, { Component } from "react"
import paper from "paper"
import { connect } from "react-redux"

import { bindIndexToActionCreator } from "./actionCreatorUtilities"
import Point, { pointActionCreators } from "./Point"

// const pointDispatchProperties = index => dispatch =>
//   bindActionCreators(
//     bindIndexToActionCreator(pointActionCreators.setPosition, index),
//     dispatch
//   )

const pointDispatchProperties = index => dispatch => ({
  setPosition: (x, y) => {
    dispatch(
      bindIndexToActionCreator(pointActionCreators.setPosition, index)(x, y)
    )
  },
  setNotesPosition: (x, y) => {
    dispatch(
      bindIndexToActionCreator(pointActionCreators.setNotesPosition, index)(
        x,
        y
      )
    )
  },
  setNotesTethered: tethered => {
    dispatch(
      bindIndexToActionCreator(pointActionCreators.setNotesTethered, index)(
        tethered
      )
    )
  }
})

class CanvasView extends Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
  }

  componentDidMount = () => {
    this.project = new paper.Project(this.canvas.current)
  }

  render() {
    return (
      <React.Fragment>
        <canvas width={500} height={500} ref={this.canvas} />
        {this.props.points.map((point, i) => {
          return (
            <Point
              pointModel={point}
              {...pointDispatchProperties(i)(this.props.dispatch)}
            />
          )
        })}
        <button
          onClick={() => {
            this.props.dispatch({ type: "ADD_POINT" })
          }}
        >
          Add Point
        </button>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    points: state.points
  }
}

export default connect(mapStateToProps)(CanvasView)
