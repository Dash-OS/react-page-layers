import React, { Component, PropTypes } from 'react'

export default class OnLayer extends Component {
  componentWillUnmount = () => {
    const { pageLayers } = this.context
    pageLayers.registry('child', 'unmount', this)
  }
  componentWillMount = () => {
    const { pageLayers } = this.context
    pageLayers.registry('child', 'mount', this)
  }
  componentWillReceiveProps = np => {
    if ( this.props.show !== np.show ) {
      this.setLayerVisibility(np)
    } else {
      this.updateLayerContent()
    }
  }
  setLayerVisibility = props => {
    const { pageLayers } = this.context
    pageLayers.controller('visibility', { visible: props.show }, this)
  }
  updateLayerContent = () => {
    const { pageLayers } = this.context
    pageLayers.controller('update', {}, this)
  }
  render = () => null
}

OnLayer.propTypes = {
  layerID: PropTypes.string.isRequired,
  childID: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
}

OnLayer.contextTypes = {
  pageLayers: PropTypes.shape({
    registry: PropTypes.func.isRequired,
    controller: PropTypes.func.isRequired,
    getLayerContent: PropTypes.func.isRequired
  }).isRequired
}

// <Layer id='mylayer' show={false}>
  
// </Layer>