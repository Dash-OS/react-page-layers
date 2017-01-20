import React, { Component, PropTypes } from 'react'

export default class Layer extends Component {
  componentWillUnmount = () => this.context.pageLayers.registry('layer', 'unmount', this)
  componentWillMount = () => this.context.pageLayers.registry('layer', 'mount', this)
  render = () => this.context.pageLayers.getLayerContent(this)
}

Layer.propTypes = {
  layerID: PropTypes.string.isRequired
}

Layer.contextTypes = {
  pageLayers: PropTypes.shape({
    registry: PropTypes.func.isRequired,
    getLayerContent: PropTypes.func.isRequired
  }).isRequired
}