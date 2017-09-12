"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var flatten = function flatten(array) {
  return Array.prototype.concat.apply([], array);
};

exports.flatten = flatten;
var sqr = function sqr(x) {
  return x * x;
};

var distance = function distance(a, b) {
  return sqr(a[0] - b[0]) + sqr(a[1] - b[1]);
};

var closestOfSegment = function closestOfSegment(p, v, w) {
  var l2 = distance(v, w);
  if (l2 === 0) return v;
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  if (t < 0) return v;
  if (t > 1) return w;
  return [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])];
};

var snapToPolyline = function snapToPolyline(latlng, positions) {
  var minDistance = Number.MAX_VALUE;
  var closest = null;
  for (var i = 0, len = positions.length - 1; i < len; ++i) {
    var p = closestOfSegment(latlng, positions[i], positions[i + 1]);
    var d = distance(latlng, p);
    if (d < minDistance) {
      closest = p;
      minDistance = d;
    }
  }
  return closest;
};

exports.snapToPolyline = snapToPolyline;
var closestIndexOfPolyline = function closestIndexOfPolyline(latlng, positions) {
  var minDistance = Number.MAX_VALUE;
  var closestIndex = null;
  for (var i = 0, len = positions.length - 1; i < len; ++i) {
    var p = closestOfSegment(latlng, positions[i], positions[i + 1]);
    var d = distance(latlng, p);
    if (d < minDistance) {
      closestIndex = i;
      minDistance = d;
    }
  }
  return closestIndex;
};

exports.closestIndexOfPolyline = closestIndexOfPolyline;
var toArrayLatLng = function toArrayLatLng(latLng) {
  return [latLng.lat, latLng.lng];
};

exports.toArrayLatLng = toArrayLatLng;
var toObjLatLng = function toObjLatLng(latLng) {
  return L.latLng(latLng[0], latLng[1]);
};

exports.toObjLatLng = toObjLatLng;
var objectWithoutProperties = function objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }
  }
  return target;
};
exports.objectWithoutProperties = objectWithoutProperties;