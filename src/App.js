import React, { Component } from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"

import { PointModel, pointActions } from "./Point"
import { noteActions } from "./Notes"
import { selectedAction } from "./selected"
import CanvasView from "./CanvasView"
import { RulerModel, rulerActions } from "./Ruler"
import { AngleArrayUtility } from "./AngleArrayUtility"
import { angleActions } from "./Angle"

let INITIAL_STATE = {
  selectedItem: null,
  points: [],
  rulers: [],
  angles: []
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
    case "RULER":
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
      if (action.parentType === "RULER") {
        items[action.index].notes[action.rulerIndex].position = {
          x: action.x,
          y: action.y
        }
        break
      }

      items[action.index].notes.position = { x: action.x, y: action.y }
      break
    case noteActions.SET_TETHERED:
      if (action.parentType === "RULER") {
        items[action.index].notes[action.rulerIndex].tethered = action.tethered
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
    case rulerActions.SET_POSITION:
      var rulers = [...state.rulers]
      rulers[action.index].position[action.rulerIndex] = {
        x: action.x,
        y: action.y
      }

      var angles = AngleArrayUtility.updateAngles(
        state.angles,
        action.index,
        state.rulers
      )

      return { ...state, rulers, angles: angles }
    case angleActions.SET_COMPLEMENT:
      var angles = [...state.angles]
      angles[action.index.i][action.index.j].complement = action.complement
      return { ...state, angles }
    case "ADD_POINT":
      points = [...state.points]
      points.push(new PointModel(75, 75))
      return { ...state, points }
    case "ADD_RULER":
      rulers = [...state.rulers]
      rulers.push(new RulerModel([{ x: 75, y: 75 }, { x: 150, y: 150 }]))
      var angles = AngleArrayUtility.addLine(state.angles)

      return { ...state, rulers, angles }
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
