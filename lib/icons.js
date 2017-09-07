'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var mouseOverWaypointIcon = L.divIcon({
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  className: '',
  html: '<svg width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\' preserveAspectRatio=\'xMidYMid\'>\n\t\t\t<circle cx=\'50\' cy=\'50\' r=\'40\' fill=\'white\' stroke=\'rgba(0,0,0,0.7)\' stroke-width=\'10\'></circle>\n\t\t</svg>'
});

exports.mouseOverWaypointIcon = mouseOverWaypointIcon;
var draggableWaypointIcon = L.divIcon({
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  className: '',
  html: '<svg width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\' preserveAspectRatio=\'xMidYMid\'>\n\t\t\t<circle cx=\'50\' cy=\'50\' r=\'40\' fill=\'white\' stroke=\'rgba(0,0,0,0.7)\' stroke-width=\'10\'></circle>\n\t\t</svg>'
});
exports.draggableWaypointIcon = draggableWaypointIcon;