import React, { Component } from "react"
import { connect } from "react-redux"
import paper from "paper"

import PointManager from "./PointManager"

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
        <PointManager />
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

export default connect()(CanvasView)
