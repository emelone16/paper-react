import React, { Component } from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"

import { PointModel, pointActions } from "./Point"
import { noteActions } from "./Notes"
import { selectedAction } from "./selected"
import CanvasView from "./CanvasView"
import { RulerModel, rulerActions } from "./Ruler"

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
    case "RULER-1":
    case "RULER-2":
      return [
        [...state.rulers],
        items => {
          return { ...state, rulers: items }
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
      if (action.parentType === "RULER-1") {
        items[action.index].notes1.position = {
          x: action.x,
          y: action.y
        }
        break
      } else if (action.parentType === "RULER-2") {
        items[action.index].notes2.position = {
          x: action.x,
          y: action.y
        }
        break
      }

      items[action.index].notes.position = { x: action.x, y: action.y }
      break
    case noteActions.SET_TETHERED:
      if (action.parentType === "RULER-1") {
        items[action.index].notes1.tethered = action.tethered
        break
      } else if (action.parentType === "RULER-2") {
        items[action.index].notes2.tethered = action.tethered
        break
      }
      
      items[action.index].notes.tethered = action.tethered
      break
    default:
      return state
  }

  return binder(items)
}

const reducer = (state = INITIAL_STATE, action) => {
  if (action.type.includes("NOTE/")) return notesReducer(state, action)

  switch (action.type) {
    case pointActions.SET_POSITION:
      var points = [...state.points]
      points[action.index].x = action.x
      points[action.index].y = action.y
      return { ...state, points }
    case rulerActions.SET_POSITION_1:
      var rulers = [...state.rulers]
      rulers[action.index].position1 = { x: action.x, y: action.y }
      return { ...state, rulers}
    case rulerActions.SET_POSITION_2:
      var rulers = [...state.rulers]
      rulers[action.index].position2 = { x: action.x, y: action.y }
      return { ...state, rulers}
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
