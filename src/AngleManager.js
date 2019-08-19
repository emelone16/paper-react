import React, { Component } from "react"
import { connect } from "react-redux"

import Angle, { angleActionCreators } from "./Angle"
import { AngleArrayUtility } from "./AngleArrayUtility"
import { bindIndexToActionCreator } from "./actionCreatorUtilities"

const angleDispatchProperties = index => dispatch => ({
  setComplement: complement => {
    dispatch(
      bindIndexToActionCreator(angleActionCreators.setComplement, index)(
        complement
      )
    )
  }
})

class AngleManager extends Component {
  render() {
    const { angles, rulers } = this.props

    return (
      <React.Fragment>
        {AngleArrayUtility.toList(angles, rulers).map(props => {
          return (
            <Angle
              {...props}
              {...angleDispatchProperties({ i: props.i, j: props.j })(
                this.props.dispatch
              )}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    angles: state.angles,
    rulers: state.rulers,
    selected: state.selected
  }
}

export default connect(mapStateToProps)(AngleManager)
