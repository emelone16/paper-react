import React, { Component } from "react"
import paper from "paper"

import Notes, { NotesModel } from "./Notes"
import { ColorModel } from "./Color"

export class RulerModel {
  static CIRCLE_RADIUS = 25
  static INNER_CIRCLE_RADIUS = 4.25
  static STROKE_WIDTH = 1
  static HITBOX_WIDTH = 30

  constructor(
    position1,
    position2,
    notes1 = new NotesModel(
      {
        x: position1.x + RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10,
        y: position1.y
      },
      "HI"
    ),
    notes2 = new NotesModel(
      {
        x: position2.x + RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10,
        y: position2.y
      },
      "HELLO"
    ),
    color = new ColorModel()
  ) {
    this.position1 = position1
    this.position2 = position2
    this.notes1 = notes1
    this.notes2 = notes2
    this.color = color
  }
}

export const rulerActions = {
  SET_POSITION_1: "RULER/SET_POSITION_1",
  SET_POSITION_2: "RULER/SET_POSITION_2",
}

export const rulerActionCreators = {
  setPosition: (i, x, y) => {
    return {
      type: i === 0 ? rulerActions.SET_POSITION_1 : rulerActions.SET_POSITION_2,
      x,
      y
    }
  }
}

export default class Ruler extends Component {
  setupPoint = i => {
    const { rulerModel, setPosition1, setPosition2, setNotesPosition1, setNotesPosition2} = this.props
    const notesModel = i === 0 ? rulerModel.notes1 : rulerModel.notes2
    const setPosition = i === 0 ? setPosition1 : setPosition2
    const setNotesPosition = i === 0 ? setNotesPosition1 : setNotesPosition2
    const point = i === 0 ? new paper.Point(rulerModel.position1.x, rulerModel.position1.y) : new paper.Point(rulerModel.position2.x, rulerModel.position2.y)

    this.outer[i] = new paper.Path.Circle(point, RulerModel.CIRCLE_RADIUS / paper.view.zoom)
    this.outer[i].strokeColor = rulerModel.color.base
    this.outer[i].fillColor = rulerModel.color.unselected
    this.outer[i].opacity = 0

    this.inner[i] = new paper.Path.Circle(point, RulerModel.INNER_CIRCLE_RADIUS / paper.view.zoom)
    this.inner[i].fillColor = rulerModel.color.base

    this.outer[i].onMouseDrag = event => {
      setPosition(this.outer[i].position.x + event.delta.x, this.outer[i].position.y + event.delta.y)

      if (notesModel.tethered) {
        setNotesPosition(this.outer[i].position.x + RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10, this.outer[i].position.y)
      } 
    }

    this.inner[i].onMouseDrag = this.outer[i].onMouseDrag
  }

  setupLine = () => {
    const {
      rulerModel, setPosition1, setPosition2, setNotesPosition1, setNotesPosition2
    } = this.props
    let point1 = new paper.Point(rulerModel.position1.x, rulerModel.position1.y)
    let point2 = new paper.Point(rulerModel.position2.x, rulerModel.position2.y)

    this.line = new paper.Path.Line(point1, point2)
    this.line.strokeColor = rulerModel.color.base
    this.line.strokeWidth = RulerModel.STROKE_WIDTH / paper.view.zoom

    this.hitbox = new paper.Path.Line(point1, point2)
    this.hitbox.strokeColor = rulerModel.color.base
    this.hitbox.strokeWidth = RulerModel.HITBOX_WIDTH / paper.view.zoom
    this.hitbox.opacity = 0

    this.hitbox.onMouseDrag = event => {
      setPosition1(this.outer[0].position.x + event.delta.x, this.outer[0].position.y + event.delta.y)
      setPosition2(this.outer[1].position.x + event.delta.x, this.outer[1].position.y + event.delta.y)

      if (rulerModel.notes1.tethered) {
        setNotesPosition1(this.outer[0].position.x + RulerModel.CIRCLE_RADIUS / paper.view.zoom +
          10, this.outer[0].position.y)
      }

      if (rulerModel.notes2.tethered) {
        setNotesPosition2(this.outer[1].position.x + RulerModel.CIRCLE_RADIUS / paper.view.zoom +
          10, this.outer[1].position.y)
      }
    }

  }

  componentDidMount = () => {
    this.outer = []
    this.inner = []

    this.setupLine()
    this.setupPoint(0)
    this.setupPoint(1)
  }

  componentDidUpdate = () => {
    const { rulerModel, selected } = this.props
    let point1 = new paper.Point(rulerModel.position1.x, rulerModel.position1.y)
    let point2 = new paper.Point(rulerModel.position2.x, rulerModel.position2.y)

    this.outer[0].position = point1
    this.inner[0].position = point1
    this.outer[1].position = point2
    this.inner[1].position = point2

    this.line.segments[0].point = point1
    this.line.segments[1].point = point2

    this.hitbox.segments[0].point = point1
    this.hitbox.segments[1].point = point2
  }

  checkIntersectionAndSnap1 = text => {
    const intersects = this.outer[0].intersects(text)
    if (!intersects) return null
    return this.outer[0].position.add(
      new paper.Point(RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10, 0)
    )
  }

  checkIntersectionAndSnap2 = text => {
    const intersects = this.outer[1].intersects(text)
    if (!intersects) return null
    return this.outer[1].position.add(
      new paper.Point(RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10, 0)
    )
  }

  render() {
    const { setNotesPosition1, setNotesPosition2, setNotesTethered1, setNotesTethered2 } = this.props

    return (
      <React.Fragment>
        <Notes setNotesPosition={setNotesPosition1} setNotesTethered={setNotesTethered1} checkIntersectionAndSnap={this.checkIntersectionAndSnap1} notesModel={this.props.rulerModel.notes1} />
        <Notes setNotesPosition={setNotesPosition2} setNotesTethered={setNotesTethered2} checkIntersectionAndSnap={this.checkIntersectionAndSnap2} notesModel={this.props.rulerModel.notes2} />
      </React.Fragment>
    )
  }
}
