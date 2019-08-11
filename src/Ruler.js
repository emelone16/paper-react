import React, { Component } from "react"
import paper from "paper"

import Notes, { NotesModel } from "./Notes"
import { ColorModel } from "./Color"

export class RulerModel {
  static CIRCLE_RADIUS = 25
  static INNER_CIRCLE_RADIUS = 4.25
  static STROKE_WIDTH = 1

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

export default class Ruler extends Component {
  setupPoint1 = () => {
    const { rulerModel, selected } = this.props

    let point = new paper.Point(rulerModel.position1.x, rulerModel.position1.y)

    this.outer1 = new paper.Path.Circle(
      point,
      RulerModel.CIRCLE_RADIUS / paper.view.zoom
    )

    this.outer1.strokeColor = rulerModel.color.base
    this.outer1.fillColor = selected
      ? rulerModel.color.selected
      : rulerModel.color.unselected
    this.outer1.strokeWidth = RulerModel.STROKE_WIDTH / paper.view.zoom

    this.inner1 = new paper.Path.Circle(
      point,
      RulerModel.INNER_CIRCLE_RADIUS / paper.view.zoom
    )
    this.inner1.fillColor = rulerModel.color.base
  }

  setupPoint2 = () => {
    const { rulerModel, selected } = this.props

    let point = new paper.Point(rulerModel.position2.x, rulerModel.position2.y)

    this.outer2 = new paper.Path.Circle(
      point,
      RulerModel.CIRCLE_RADIUS / paper.view.zoom
    )

    this.outer2.strokeColor = rulerModel.color.base
    this.outer2.fillColor = selected
      ? rulerModel.color.selected
      : rulerModel.color.unselected
    this.outer2.strokeWidth = RulerModel.STROKE_WIDTH / paper.view.zoom

    this.inner2 = new paper.Path.Circle(
      point,
      RulerModel.INNER_CIRCLE_RADIUS / paper.view.zoom
    )
    this.inner2.fillColor = rulerModel.color.base
  }

  componentDidMount = () => {
    this.setupPoint1()
    this.setupPoint2()
  }

  render() {
    return (
      <React.Fragment>
        <Notes notesModel={this.props.rulerModel.notes1} />
        <Notes notesModel={this.props.rulerModel.notes2} />
      </React.Fragment>
    )
  }
}
