import React, { Component } from "react"
import paper from "paper"

export class NotesModel {
  constructor(position, text = "", showing = true, tethered = true) {
    this.position = position
    this.text = text
    this.showing = showing
    this.tethered = tethered
  }
}

export default class Notes extends Component {
  setupActions = () => {
    const {
      notesModel,
      setNotesPosition,
      setNotesTethered,
      checkIntersectionAndSnap
    } = this.props

    this.text.onMouseDown = _ => setNotesTethered(false)

    this.text.onMouseDrag = event => {
      let snapPoint = checkIntersectionAndSnap(this.text)
      if (snapPoint) {
        setNotesTethered(true)
        setNotesPosition(snapPoint.x, snapPoint.y)
      }

      if (notesModel.tethered == false) {
        setNotesPosition(
          this.text.point.x + event.delta.x,
          this.text.point.y + event.delta.y
        )
      }
    }
  }

  componentDidMount = () => {
    const { notesModel } = this.props
    let position = new paper.Point(notesModel.position.x, notesModel.position.y)
    this.text = new paper.PointText(position)
    this.text.point = position
    this.text.content = notesModel.text
    this.text.visible = notesModel.showing

    this.setupActions()
  }

  componentDidUpdate = () => {
    const { notesModel } = this.props
    let position = new paper.Point(notesModel.position.x, notesModel.position.y)
    this.text.point = position
    this.text.content = notesModel.text
    this.text.visible = notesModel.showing
  }

  render() {
    return <React.Fragment />
  }
}
