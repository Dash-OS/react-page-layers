import React, { Component, PropTypes } from 'react'

export default class PageLayerProvider extends Component {
  layers = {}
  children = {}
  mounts = {}
  visibility = {}
  
  constructor(props) {
    super(props)
  }
  
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
    if ( this.layers[layerID] ) {
      // Is there a more efficient way than force updating to update the parent?
      this.layers[layerID].context.forceUpdate()
    }
  }
  
  mountLayer = (id, context) => {
    this.layers[id] = { context }
  }
  
  unmountLayer = (id, context) => {
    delete this.layers[id]
  }
  
  mountChild = (layerID, childID, context) => {
    this.children[layerID][childID] = context
    if ( context.props.show ) { this.layerController('visibility', { visible: context.props.show }, context) }
  }
  
  unmountChild = (layerID, childID, context) => {
    delete this.children[layerID][childID]
    if ( Object.keys(this.children[layerID]) === 0 ) { delete this.children[layerID] }
  }
  
  handleRegistration = (type, state, context) => {
    //console.log('Registering: ', type, state, context)
    //if ( !  ) { throw new Error('Layers must have an ID: ', type, state, context) }
    type === 'layer'
      ? this.layerRegistration(state, context)
      : this.childRegistration(state, context)
  }
  
  layerRegistration = (state, context) => {
    const layerID = context.props.layerID
    if ( state === 'mount' && this.layers[layerID] !== undefined ) {
      throw new Error(`A Layer with ID: ${layerID} has already been registered.  Each Layer must have a unique ID!`)
    }
    if ( state === 'mount' ) { 
      this.mountLayer(layerID, context) 
    } else if ( state === 'unmount' ) {
      this.unmountLayer(layerID, context)
    }
  }
  
  childRegistration = (state, context) => {
    const layerID = context.props.layerID
    const childID = context.props.childID
    if ( ! layerID || ! childID ) { throw new Error('Can Not Register a Child without both a Layer ID and Child ID') }
    if ( ! this.children[layerID] ) { this.children[layerID] = {} }
    const childContent =  this.children[layerID][childID]
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
    console.log(id, context, this)
    if ( Array.isArray(this.visibility[id]) && this.visibility[id].length > 0 ) {
      const Children = this.visibility[id].map((childID, i) => {
        const Component = this.children[id][childID].props.children
        return Component
      })
      return <div>{Children}</div>
    } else { return null }
  }
  
  getChildContext = () => {
    return {
      pageLayers: {
        registry:   (...args) => this.handleRegistration(...args),
        controller: (...args) => this.layerController(...args),
        getLayerContent: (...args) => this.getLayersContent(...args)
      }
    }
  }
  
  render = () => React.Children.only(this.props.children)
}

PageLayerProvider.childContextTypes = {
  pageLayers: PropTypes.shape({
    registry: PropTypes.func.isRequired,
    controller: PropTypes.func.isRequired,
    getLayerContent: PropTypes.func.isRequired
  }).isRequired
}