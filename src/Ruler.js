import React, { Component } from "react"
import paper from "paper"

import Notes, { NotesModel } from "./Notes"
import {
  ColorModel
} from "./Color"
import bindMouseChanges from "./mouse"

export class RulerModel {
  static CIRCLE_RADIUS = 25
  static INNER_CIRCLE_RADIUS = 4.25
  static STROKE_WIDTH = 1
  static HITBOX_WIDTH = 30

  constructor(
    position,
    notes = [new NotesModel(
      {
        x: position[0].x + RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10,
        y: position[0].y
      },
      "HI"
    ), new NotesModel(
      {
        x: position[1].x + RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10,
        y: position[1].y
      },
      "HELLO"
    )],
    color = new ColorModel()
  ) {
    this.position = position
    this.notes = notes
    this.color = color
  }
}

export const rulerActions = {
  SET_POSITION: "RULER/SET_POSITION",
}

export const rulerActionCreators = {
  setPosition: (i, x, y) => {
    return {
      type: rulerActions.SET_POSITION,
      rulerIndex: i,
      x,
      y
    }
  }
}

export default class Ruler extends Component {
  setupPoint = i => {
    const { rulerModel, setPosition, setNotesPosition } = this.props
    const point = new paper.Point(rulerModel.position[i].x, rulerModel.position[i].y)

    
    this.inner[i] = new paper.Path.Circle(point, RulerModel.INNER_CIRCLE_RADIUS / paper.view.zoom)
    this.inner[i].fillColor = rulerModel.color.base
    
    this.outer[i] = new paper.Path.Circle(point, RulerModel.CIRCLE_RADIUS / paper.view.zoom)
    this.outer[i].strokeColor = rulerModel.color.base
    this.outer[i].fillColor = rulerModel.color.unselected
    this.outer[i].opacity = 0

    this.outer[i].onMouseDrag = event => {
      setPosition(i, this.outer[i].position.x + event.delta.x, this.outer[i].position.y + event.delta.y)

      if (rulerModel.notes[i].tethered) {
        setNotesPosition(i, this.outer[i].position.x + RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10, this.outer[i].position.y)
      } 
    }

    this.inner[i].onMouseDrag = this.outer[i].onMouseDrag
    bindMouseChanges(this.outer[i])
  }

  setupLine = () => {
    const {
      rulerModel, setPosition, setNotesPosition
    } = this.props
    let point1 = new paper.Point(rulerModel.position[0].x, rulerModel.position[0].y)
    let point2 = new paper.Point(rulerModel.position[1].x, rulerModel.position[1].y)

    this.line = new paper.Path.Line(point1, point2)
    this.line.strokeColor = rulerModel.color.base
    this.line.strokeWidth = RulerModel.STROKE_WIDTH / paper.view.zoom

    this.hitbox = new paper.Path.Line(point1, point2)
    this.hitbox.strokeColor = rulerModel.color.base
    this.hitbox.strokeWidth = RulerModel.HITBOX_WIDTH / paper.view.zoom
    this.hitbox.opacity = 0

    this.hitbox.onMouseDrag = event => {
      for (var i = 0; i <= 1; i++) {
        setPosition(i, this.outer[i].position.x + event.delta.x, this.outer[i].position.y + event.delta.y)

        if (rulerModel.notes[i].tethered) {
          setNotesPosition(i, this.outer[i].position.x + RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10, this.outer[i].position.y)
        }
      }
    }

    bindMouseChanges(this.hitbox)
  }

  componentDidMount = () => {
    this.outer = []
    this.inner = []

    this.setupLine()
    this.setupPoint(0)
    this.setupPoint(1)
  }

  componentDidUpdate = () => {
    const { rulerModel } = this.props

    for (var i = 0; i <= 1; i++) {
      let point = new paper.Point(rulerModel.position[i].x, rulerModel.position[i].y)
      this.outer[i].position = point
      this.inner[i].position = point
      this.line.segments[i].point = point
      this.hitbox.segments[i].point = point
    }
  }

  checkIntersectionAndSnap = i => text => {
    const intersects = this.outer[i].intersects(text)
    if (!intersects) return null
    return this.outer[i].position.add(
      new paper.Point(RulerModel.CIRCLE_RADIUS / paper.view.zoom + 10, 0)
    )
  }

  render() {
    const { setNotesPosition, setNotesTethered } = this.props

    return (
      <React.Fragment>
        <Notes setNotesPosition={(x, y) => setNotesPosition(0, x, y)} setNotesTethered={tethered => setNotesTethered(0, tethered)} checkIntersectionAndSnap={this.checkIntersectionAndSnap(0)} notesModel={this.props.rulerModel.notes[0]} />
        <Notes setNotesPosition={(x, y) => setNotesPosition(1, x, y)} setNotesTethered={tethered => setNotesTethered(1, tethered)} checkIntersectionAndSnap={this.checkIntersectionAndSnap(1)} notesModel={this.props.rulerModel.notes[1]} />
      </React.Fragment>
    )
  }
}
