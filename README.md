# Leaflet Draggable Polyline

A draggable polyline to use with [react-leaflet](https://github.com/PaulLeCam/react-leaflet). This may be useful if you need to edit a polyline provided by a driving directions api (such as [google maps javascript api DirectionsService](https://developers.google.com/maps/documentation/javascript/directions)).


![desktop demo](demos/leaflet-draggable-polyline-desktop.gif?raw=true "Desktop demo")
![mobile demo](demos/leaflet-draggable-polyline-mobile.gif?raw=true "Mobile demo")

## Demo & Examples

[Basic example](http://manufont.github.io/react-leaflet-draggable-polyline/)

[Example with ordered new waypoints](http://manufont.github.io/react-leaflet-draggable-polyline/reordered.html)

[Example using google maps directions](http://manufont.github.io/react-leaflet-draggable-polyline/directions.html)


## Installation

```
npm i -S react-leaflet-draggable-polyline
```


## Usage

DraggablePolyline uses React context API. It needs to be nested inside a react-leaflet `Map`.

```
import DraggablePolyline from 'react-leaflet-draggable-polyline';

<DraggablePolyline
	positions={[[43.60, 1.44], [43.61, 1.30]]}
/>
```
For a fully working example, please check out [this one](https://github.com/manufont/react-leaflet-draggable-polyline/blob/master/example/src/basic.js).

### Properties

This component extends all [react-leaflet polyline properties](https://github.com/PaulLeCam/react-leaflet/blob/master/docs/Components.md#polyline).

| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| positions | array[array[float]] or array[array[array[float]]] | | The polyline positions formatted as `[lat, lng]` arrays. If an array of positions is provided, every new waypoint will be reordered according to the positions array it has been dragged from |
| waypoints | array[array[float]] | [] | The waypoints formatted as `[lat, lng]` arrays |
| onWaypointsChange | function(waypoints, index) | | The callback that fires after every change in waypoints array. The `index` parameter represent the index of the changed waypoint. |
| onWaypointAdd | function(waypoint) | | The callback that fires after a waypoint has been added. |
| onWaypointRemove | function(waypoint, index) | | The callback that fires after a waypoint has been removed. The `index` parameter represent the index of the removed waypoint. |
| onWaypointMove | function(waypoint, index) | | The callback that fires after a waypoint has been moved. The `index` parameter represent the index of the moved waypoint. |
| mouseOverWaypointIcon | [leaflet icon](http://leafletjs.com/reference-1.2.0.html#icon) | | The icon that shows on polyline mouseover |
| draggableWaypointIcon | [leaflet icon](http://leafletjs.com/reference-1.2.0.html#icon) | | The draggable waypoints icon |
| weight | number | 10 | The weight of the polyline. It needs to be large enough to enable touch events on a mobile device. |


## Development (`src`, `lib` and the build process)

To build the examples locally, run:

```
npm install
npm start
```
Then open [`localhost:8000`](http://localhost:8000) in a browser.

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

## License

MIT