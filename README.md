# react-page-layers

While other libraries exist that provide portal like capabilities, I personally 
had some issues with a few of them.  I wanted functionality to handle layers but 
didn't like the idea of appending to the body of my DOM as I started to see 
issues where some failed to clean up after themselves.  

The concept is fairly simple.  It should **NOT** be used as an alternative to the 
top-down approach that React provides.  This library definitely has the potential 
to do so and it was not how it was meant to be used (and you will get in trouble if 
you use it that way). 

Essentially this simply allows you to "teleport" parts of your components to different 
places to be rendered.  This way you can render your modal locally with your local 
variables and state but have it render in a place that it can be put on top of all 
other elements easily.

## Install

```bash
yarn add react-page-layers
```

```bash
npm install --save react-page-layers
```

## Configuration

Configuration should be very straight forward.

### `<LayerProvider />`

Wrap your App with LayerProvider.  It doesn't have to be at the top-level, it just 
has to be above all ```<Layer /> ``` and ```<OnLayer />```  components.

```javascript

import LayerProvider from 'react-page-layers/LayerProvider'
// or import { LayerProvider } from 'react-page-layers'

ReactDOM.render(
  <LayerProvider>
    <App />
  </LayerProvider>,
  document.querySelector('#app')
)

```

***

### `<Layer />`

```javascript

import Layer from 'react-page-layers/Layer'
// or import { Layer } from 'react-page-layers'

const MyComponent = () => (
  <div>
    <h1>MyComponent Header</h1>
    <Layer id='UnderHeader' />
  </div>
)

```

A Layer is a point in the DOM you want to be able to render your child elements.  
You will be able to "mount" components onto layers from anywhere within the App. It 
should not have any children (well, they will just be ignored).  

| Prop        | Type(s)           | Description  |
| -------------   |:-------------:| ----- |
| **layerID**     | string | Required unique id which is not shared with any other `<Layer />` in your app. |

### `<OnLayer />`

```javascript

import OnLayer from 'react-page-layers/OnLayer'
// or import { OnLayer } from 'react-page-layers'

const AnotherComopnent = () => (
  <div>
    <OnLayer layerID='UnderHeader' childID='FromAnotherComponent' show={true}>
      <div>Another Component says Hi on MyComponent!</div>
    </OnLayer>
  </div>
)

```

`<OnLayer />` is where you specify content that should be rendered into your `<Layer />`.  Simply 
provide it with the ```layerID``` of the Layer it should render into.  Each `<OnLayer />` must have its 
own unique ID that is not shared with any other OnLayer (although this is only enforced for the layer it renders onto). 
You must also provide a boolean value to ```show``` to determine if the content should be rendered or not.

| Prop        | Type(s)           | Description  |
| -------------   |:-------------:| ----- |
| **layerID**     | string | Required ID of the `<Layer />` we should render into. |
| **childID**     | string | Required Unique ID for your `<OnLayer />` which is not shared with any other child. |
| **show**        | boolean | Required boolean indicating if we should render the children into the `<Layer />` |

