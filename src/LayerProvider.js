import React, { Component, PropTypes } from 'react'

export default class PageLayerProvider extends Component {
  
  layers = {}; childLayers = {}; visibility = {}
  
  layerController = (action, props, context) => {
    const layerID = props.layerID || context.props.layerID
    const childID = props.childID || context.props.childID
    switch(action) {
      case 'visibility': {
        if ( props.visible === undefined ) { throw new Error('Tried to set visiibility but provided no control prop (visibility)' ) }
        if ( ! this.visibility[layerID] ) { this.visibility[layerID] = [] }
        if ( props.visible && ! this.visibility[layerID].includes(childID) ) {
          this.visibility[layerID].push(childID)
        } else if ( ! props.visible && this.visibility[layerID].includes(childID) ) {
          this.visibility[layerID] = this.visibility[layerID].filter(e => e !== childID)
        }
        break
      }
    }
    // Is there a more efficient way than force updating to update the parent?
    this.updateLayer(layerID)
  }
  
  mountLayer = (id, context) => {
    this.layers[id] = { context } 
    Array.isArray(this.visibility[id]) && ( context.forceUpdate() )
  }
  
  unmountLayer = (id, context) => ( delete this.layers[id] )
  
  mountChild = (layerID, childID, context) => {
    this.childLayers[layerID][childID] = context
    context.props.show === true 
      && ( this.layerController('visibility', { visible: true }, context) )
  }
  
  updateLayer = layerID => this.layers[layerID] && this.layers[layerID].context.forceUpdate()
  
  unmountChild = (layerID, childID, context) => {
    delete this.childLayers[layerID][childID]
    if ( Object.keys(this.childLayers[layerID]) === 0 ) { delete this.childLayers[layerID] }
    context.props.show === true 
      && ( this.layerController('visibility', { visible: false }, context) )
  }
  
  handleRegistration = (type, state, context) => {
    type === 'layer'
      ? this.layerRegistration(state, context)
      : this.childRegistration(state, context)
  }
  
  layerRegistration = (state, context) => {
    const layerID = context.props.layerID
    if ( state === 'mount' && this.layers[layerID] !== undefined ) {
      throw new Error(`A Layer with ID: ${layerID} has already been registered.  Each Layer must have a unique ID!`)
    }
    state === 'mount'
      ? this.mountLayer(layerID, context) : this.unmountLayer(layerID, context)
  }
  
  childRegistration = (state, context) => {
    const layerID = context.props.layerID, 
          childID = context.props.childID
    if ( ! layerID || ! childID ) { throw new Error('Can Not Register a Child without both a Layer ID and Child ID') }
    if ( ! this.childLayers[layerID] ) { this.childLayers[layerID] = {} }
    const childContent =  this.childLayers[layerID][childID]
    if ( state === 'mount' && childContent ) {
      throw new Error(`You may not register a child with the same layer and child ID more than once: Layer (${layerID}) Child (${childID})`)
    } else if ( state === 'mount' ) {
      this.mountChild(layerID, childID, context)
    } else if ( state === 'unmount' && ! childContent ) {
      console.warn('A Layer tried to unmount but was not found')
    } else if ( state === 'unmount' ) {
      this.unmountChild(layerID, childID, context)
    }
  }
  
  getLayersContent = (context) => {
    const id = context.props.layerID
    if ( Array.isArray(this.visibility[id]) && this.visibility[id].length > 0 ) {
      const Children = this.visibility[id].map( childID => this.childLayers[id][childID].props.children )
      return <div>{Children}</div>
    } else { return null }
  }
  
  getChildContext = () => ({
    pageLayers: {
      registry:        (...args) => this.handleRegistration(...args),
      controller:      (...args) => this.layerController(...args),
      getLayerContent: (...args) => this.getLayersContent(...args)
    }
  })
  
  render = () => this.props.children
}

PageLayerProvider.childContextTypes = {
  pageLayers: PropTypes.shape({
    registry: PropTypes.func.isRequired,
    controller: PropTypes.func.isRequired,
    getLayerContent: PropTypes.func.isRequired
  }).isRequired
}