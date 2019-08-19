import React, { Component } from "react"
import paper from "paper"

import { ColorModel } from "./Color"

export class AngleModel {
  static CIRCLE_RADIUS = 25
  static INNER_CIRCLE_RADIUS = 4.25
  static STROKE_WIDTH = 1

  constructor(
    position,
    measurement = 0,
    complement = false,
    active = false,
    color = new ColorModel()
  ) {
    this.position = position
    this.measurement = measurement
    this.complement = complement
    this.active = active
    this.color = color
  }
}

export const angleActions = {
  SET_COMPLEMENT: "ANGLE/SET_COMPLEMENT"
}

export const angleActionCreators = {
  setComplement: complement => {
    return {
      type: angleActions.SET_COMPLEMENT,
      complement
    }
  }
}

class Angle extends Component {
  extractArcPoints = () => {
    let { angleModel, line1, line2 } = this.props
    let intersection = new paper.Point(
      angleModel.position.x,
      angleModel.position.y
    )

    var points = []

    points.push(new paper.Point(line1[0].x, line1[0].y))
    points.push(new paper.Point(line2[0].x, line2[0].y))
    points.push(new paper.Point(line1[1].x, line1[1].y))
    points.push(new paper.Point(line2[1].x, line2[1].y))

    points = points.map(point => point.subtract(intersection))

    var arcs = []

    for (var i = 0; i <= 3; i++) {
      arcs.push(
        new paper.Point(
          points[i].x + points[(i + 1) % 4].x,
          points[i].y + points[(i + 1) % 4].y
        )
      )
    }

    for (i = 0; i <= 3; i++) {
      points.splice(1 + 2 * i, 0, arcs[i])
    }

    points = points.map(point =>
      point.normalize(AngleModel.CIRCLE_RADIUS / paper.view.zoom)
    )

    points = points.map(point => intersection.add(point))

    return points
  }

  drawInnerPoint = () => {
    let { angleModel } = this.props
    let point = new paper.Point(angleModel.position.x, angleModel.position.y)

    if (!this.inner) {
      this.inner = new paper.Path.Circle(
        point,
        AngleModel.INNER_CIRCLE_RADIUS / paper.view.zoom
      )
      this.inner.fillColor = angleModel.color.base
    }

    this.inner.position = point
  }

  drawWedges = () => {
    let { angleModel, setComplement } = this.props
    let intersection = new paper.Point(
      angleModel.position.x,
      angleModel.position.y
    )
    var points = this.extractArcPoints()

    try {
      for (var i = 0; i <= 3; i++) {
        if (this.wedges[i]) {
          this.wedges[i].remove()
        }

        let arc = new paper.Path.Arc(
          points[2 * i],
          points[2 * i + 1],
          points[(2 * i + 2) % 8]
        )
        arc.remove()

        this.wedges[i] = new paper.Path([
          intersection,
          ...arc.segments,
          intersection
        ])
        this.wedges[i].closed = true
        this.wedges[i].strokeColor = angleModel.color.base
        this.wedges[i].fillColor = angleModel.color.unselected
      }
    } catch (_) {
      this.wedges.forEach(wedge => wedge.remove)
      this.wedges = []
    }

    if (angleModel.complement) {
      this.wedges[1].fillColor = angleModel.color.selected
      this.wedges[3].fillColor = angleModel.color.selected
    } else {
      this.wedges[0].fillColor = angleModel.color.selected
      this.wedges[2].fillColor = angleModel.color.selected
    }

    this.wedges.forEach((wedge, i) => {
      wedge.onMouseDown = _ => {
        if (i % 2 === 0) {
          setComplement(false)
        } else {
          setComplement(true)
        }
      }
    })
  }

  componentDidMount = () => {
    this.wedges = []

    this.drawInnerPoint()
    this.drawWedges()
  }

  componentWillUnmount = () => {
    this.inner.remove()
    this.wedges.forEach(wedge => wedge.remove())
  }

  componentDidUpdate = () => {
    this.drawInnerPoint()
    this.drawWedges()
  }

  render() {
    return <React.Fragment />
  }
}

export default Angle
