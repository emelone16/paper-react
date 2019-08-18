import React, { Component } from "react"
import { connect } from "react-redux"

import Angle from "./Angle"
import { AngleArrayUtility } from "./AngleArrayUtility"

class AngleManager extends Component {
  render() {
    const { angles, rulers } = this.props

    return (
      <React.Fragment>
        {AngleArrayUtility.toList(angles, rulers).map(props => {
          return <Angle {...props} />
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
