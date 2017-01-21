import React, { Component, PropTypes } from 'react'

export default class OnLayer extends Component {
  componentWillUnmount = () => 
    this.context.pageLayers.registry('child', 'unmount', this)
    
  componentDidMount = () => 
    this.context.pageLayers.registry('child', 'mount', this)
    
  setLayerVisibility = props => 
    this.context.pageLayers.controller('visibility', { visible: props.show }, this)
    
  updateLayerContent = () => 
    this.context.pageLayers.controller('update', {}, this)
    
  componentWillReceiveProps = np => {
    this.props.show !== np.show && ( this.setLayerVisibility(np) )
    np.show === true && ( this.updateLayerContent() )
    this.props.layerID !== np.layerID && (() => {
      this.context.pageLayers.registry('child', 'unmount', this)
      this.context.pageLayers.registry('child', 'mount', {...this, props: np})
    })()
  }
  
  render = () => null
}

OnLayer.propTypes = {
  layerID: PropTypes.string.isRequired,
  childID: PropTypes.string.isRequired,
  show:    PropTypes.bool.isRequired
}

OnLayer.contextTypes = {
  pageLayers: PropTypes.shape({
    registry:   PropTypes.func.isRequired,
    controller: PropTypes.func.isRequired,
  }).isRequired
}
