import React, { Component } from "react"
import { connect } from "react-redux"
import paper from "paper"

import PointManager from "./PointManager"
import RulerManager from "./RulerManager"
import AngleManager from "./AngleManager"

class CanvasView extends Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
  }

  componentDidMount = () => {
    this.project = new paper.Project(this.canvas.current)
    document.body.style.cursor = "default"
  }

  render() {
    return (
      <React.Fragment>
        <canvas width={500} height={500} ref={this.canvas} />
        <PointManager />
        <RulerManager />
        <AngleManager />
        <button
          onClick={() => {
            this.props.dispatch({ type: "ADD_POINT" })
          }}
        >
          Add Point
        </button>
        <button
          onClick={() => {
            this.props.dispatch({ type: "ADD_RULER" })
          }}
        >
          Add Ruler
        </button>
      </React.Fragment>
    )
  }
}

export default connect()(CanvasView)
