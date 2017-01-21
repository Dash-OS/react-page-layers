import React, { Component, PropTypes } from 'react'

export default class Layer extends Component {
  componentWillUnmount = () =>
    this.context.pageLayers.registry('layer', 'unmount', this)
  
  componentDidMount = () => 
    this.context.pageLayers.registry('layer', 'mount', this)
  
  componentWillReceiveProps = np => np.show !== this.props.show
      && this.context.pageLayers.registry('layer', np.show === true ? 'mount' : 'unmount', this)
  
  shouldComponentUpdate = np => np.show !== this.props.show

  render = () => this.props.show === true 
    ? this.context.pageLayers.getLayerContent(this)
    : null
}

Layer.defaultProps = { show: true }

Layer.propTypes = {
  layerID: PropTypes.string.isRequired,
  show: PropTypes.bool
}

Layer.contextTypes = {
  pageLayers: PropTypes.shape({
    registry: PropTypes.func.isRequired,
    getLayerContent: PropTypes.func.isRequired
  }).isRequired
}