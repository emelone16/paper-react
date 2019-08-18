import React, { Component } from "react"
import paper from "paper"

import { ColorModel } from "./Color"
import Notes, { NotesModel } from "./Notes"
import bindMouseChanges from "./mouse"

export class PointModel {
  static CIRCLE_RADIUS = 25
  static INNER_CIRCLE_RADIUS = 4.25
  static STROKE_WIDTH = 1

  constructor(
    x,
    y,
    notes = new NotesModel(
      { x: x + PointModel.CIRCLE_RADIUS / paper.view.zoom + 10, y: y },
      "HELLO"
    ),
    color = new ColorModel()
  ) {
    this.x = x
    this.y = y
    this.notes = notes
    this.color = color
  }
}

export const pointActions = {
  SET_POSITION: "POINT/SET_POSITION"
}

export const pointActionCreators = {
  setPosition: (x, y) => {
    return {
      type: pointActions.SET_POSITION,
      x,
      y
    }
  }
}

class Point extends Component {
  setupOuterPoint = () => {
    let { pointModel, selected } = this.props
    let point = new paper.Point(pointModel.x, pointModel.y)

    this.outer = new paper.Path.Circle(
      point,
      PointModel.CIRCLE_RADIUS / paper.view.zoom
    )

    this.outer.strokeColor = pointModel.color.base
    this.outer.fillColor = selected
      ? pointModel.color.selected
      : pointModel.color.unselected
    this.outer.strokeWidth = PointModel.STROKE_WIDTH / paper.view.zoom
  }

  setupInnerPoint = () => {
    let { pointModel } = this.props
    let point = new paper.Point(pointModel.x, pointModel.y)

    this.inner = new paper.Path.Circle(
      point,
      PointModel.INNER_CIRCLE_RADIUS / paper.view.zoom
    )
    this.inner.fillColor = pointModel.color.base
  }

  setupActions = () => {
    const {
      pointModel,
      setPosition,
      setNotesPosition,
      setSelected
    } = this.props

    this.outer.onMouseDown = _ => setSelected()

    this.outer.onMouseDrag = event => {
      setPosition(
        this.outer.position.x + event.delta.x,
        this.outer.position.y + event.delta.y
      )

      if (pointModel.notes.tethered) {
        setNotesPosition(
          this.outer.position.x +
            PointModel.CIRCLE_RADIUS / paper.view.zoom +
            10,
          this.outer.position.y
        )
      }
    }

    this.inner.onMouseDrag = this.outer.onMouseDrag
    this.inner.onMouseDown = this.outer.onMouseDown

    bindMouseChanges(this.outer)
  }

  componentDidMount = () => {
    this.setupInnerPoint()
    this.setupOuterPoint()
    this.setupActions()
  }

  componentDidUpdate = () => {
    const { pointModel, selected } = this.props
    let point = new paper.Point(pointModel.x, pointModel.y)
    this.outer.position = point
    this.outer.fillColor = selected
      ? pointModel.color.selected
      : pointModel.color.unselected

    this.inner.position = point
  }

  checkIntersectionAndSnap = text => {
    const intersects = this.outer.intersects(text)
    if (!intersects) return null
    return this.outer.position.add(
      new paper.Point(PointModel.CIRCLE_RADIUS / paper.view.zoom + 10, 0)
    )
  }

  render() {
    const { pointModel, setNotesPosition, setNotesTethered } = this.props

    return (
      <React.Fragment>
        <Notes
          notesModel={pointModel.notes}
          setNotesPosition={setNotesPosition}
          setNotesTethered={setNotesTethered}
          checkIntersectionAndSnap={this.checkIntersectionAndSnap}
        />
      </React.Fragment>
    )
  }
}

export default Point
