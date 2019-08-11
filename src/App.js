import React, { Component } from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"

import { PointModel, pointActions } from "./Point"
import { noteActions } from "./Notes"
import { selectedAction } from "./selected"
import CanvasView from "./CanvasView"
import { RulerModel } from "./Ruler"

let INITIAL_STATE = {
  selectedItem: null,
  points: [],
  rulers: []
}

const bindToItemType = (state, type) => {
  switch (type) {
    case "POINT":
      return [
        [...state.points],
        items => {
          return { ...state, points: items }
        }
      ]
    default:
      return [null, null]
  }
}

const notesReducer = (state, action) => {
  var [items, binder] = bindToItemType(state, action.parentType)

  switch (action.type) {
    case noteActions.SET_POSITION:
      items[action.index].notes.position = { x: action.x, y: action.y }
      return binder(items)
    case noteActions.SET_TETHERED:
      items[action.index].notes.tethered = action.tethered
      return binder(items)
    default:
      return state
  }
}

const reducer = (state = INITIAL_STATE, action) => {
  if (action.type.includes("NOTE/")) return notesReducer(state, action)

  switch (action.type) {
    case pointActions.SET_POSITION:
      var points = [...state.points]
      points[action.index].x = action.x
      points[action.index].y = action.y
      return { ...state, points }
    case "ADD_POINT":
      points = [...state.points]
      points.push(new PointModel(75, 75))
      return { ...state, points }
    case "ADD_RULER":
      var rulers = [...state.rulers]
      rulers.push(new RulerModel({ x: 75, y: 75 }, { x: 150, y: 150 }))
      return { ...state, rulers }
    case selectedAction:
      return {
        ...state,
        selected: { itemType: action.itemType, index: action.index }
      }
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
