import React, { Component } from "react"
import { connect } from "react-redux"

import Ruler from "./Ruler"

class RulerManager extends Component {
  render() {
    const { rulers, selected } = this.props

    return (
      <React.Fragment>
        {rulers.map((ruler, i) => (
          <Ruler
            rulerModel={ruler}
            selected={
              selected && selected.itemType === "RULER" && selected.index === i
            }
          />
        ))}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    rulers: state.rulers,
    selected: state.selected
  }
}

export default connect(mapStateToProps)(RulerManager)
