import React, { Component } from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"

import { PointModel, pointActions } from "./Point"
import { NotesModel } from "./Notes"
import CanvasView from "./CanvasView"

let INITIAL_STATE = {
  points: []
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case pointActions.SET_POSITION:
      var points = [...state.points]
      points[action.index].x = action.x
      points[action.index].y = action.y
      return { points }
    case pointActions.SET_NOTES_POSITION:
      var points = [...state.points]
      points[action.index].notes.position = { x: action.x, y: action.y }
      return { points }
    case pointActions.SET_NOTES_TETHERED:
      var points = [...state.points]
      points[action.index].notes.tethered = action.tethered
      return { points }
    case "ADD_POINT":
      var points = [...state.points]
      points.push(new PointModel(75, 75))
      return { points }
    default:
      return state
  }
}

const store = createStore(reducer)

class App extends Component {
  state = { points: [] }

  render() {
    return (
      <Provider store={store}>
        <CanvasView />
      </Provider>
    )
  }
}

export default App
