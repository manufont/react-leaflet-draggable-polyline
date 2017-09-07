"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var minBy = function minBy(lambda, array) {
  var mapped = array.map(lambda);
  return array[mapped.indexOf(Math.min.apply(Math, _toConsumableArray(mapped)))];
};

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
  var indexOfClosest = 0;
  for (var i = 0; i < positions.length; ++i) {
    var d = distance(latlng, positions[i]);
    if (d < minDistance) {
      minDistance = d;
      indexOfClosest = i;
    }
  }
  var closest = positions[indexOfClosest];

  return minBy(function (point) {
    return distance(latlng, point);
  }, [indexOfClosest - 1, indexOfClosest + 1].map(function (index) {
    return positions[index];
  }).filter(function (point) {
    return point !== undefined;
  }).map(function (point) {
    return closestOfSegment(latlng, closest, point);
  }));
};

exports.snapToPolyline = snapToPolyline;
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