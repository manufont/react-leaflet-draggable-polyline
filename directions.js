require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactLeaflet = require('react-leaflet');

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _reactLeafletDraggablePolyline = require('react-leaflet-draggable-polyline');

var _reactLeafletDraggablePolyline2 = _interopRequireDefault(_reactLeafletDraggablePolyline);

var gmaps = window.google.maps;

var flatMap = function flatMap(lambda, array) {
	return Array.prototype.concat.apply([], array.map(lambda));
};

var toObjLatLng = function toObjLatLng(latLng) {
	return _leaflet2['default'].latLng(latLng[0], latLng[1]);
};

var toArrayLatLng = function toArrayLatLng(latLng) {
	return [latLng.lat, latLng.lng];
};

var getPositions = function getPositions(response) {
	return flatMap(function (leg) {
		return flatMap(function (step) {
			return gmaps.geometry.encoding.decodePath(step.polyline.points).map(function (gLocation) {
				return toArrayLatLng(gLocation.toJSON());
			});
		}, leg.steps);
	}, response.routes[0].legs);
};

var getWaypoints = function getWaypoints(response) {
	return response.routes[0].legs.slice(1).map(function (leg) {
		return toArrayLatLng(leg.start_location.toJSON());
	});
};

var App = (function (_Component) {
	_inherits(App, _Component);

	function App(props) {
		_classCallCheck(this, App);

		_get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);

		this.onWaypointsChange = this.onWaypointsChange.bind(this);

		this.state = {
			waypoints: [],
			positions: [[43.604403, 1.443373], [43.613547, 1.308568]]
		};
	}

	_createClass(App, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.getDirections([]);
		}
	}, {
		key: 'onWaypointsChange',
		value: function onWaypointsChange(waypoints) {
			this.getDirections(waypoints);
		}
	}, {
		key: 'getDirections',
		value: function getDirections(waypoints) {
			var _this = this;

			var positions = this.state.positions;
			var request = {
				travelMode: window.google.maps.TravelMode.DRIVING,
				origin: toObjLatLng(positions[0]),
				destination: toObjLatLng(positions[positions.length - 1]),
				waypoints: waypoints.map(function (waypoint) {
					return {
						location: toObjLatLng(waypoint),
						stopover: true
					};
				}),
				optimizeWaypoints: true
			};
			var directionsService = new gmaps.DirectionsService();
			directionsService.route(request, function (response, status) {
				if (status === gmaps.DirectionsStatus.OK) {
					_this.setState({
						waypoints: getWaypoints(response),
						positions: getPositions(response)
					});
				}
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state;
			var waypoints = _state.waypoints;
			var positions = _state.positions;

			var bounds = _leaflet2['default'].latLngBounds(positions);

			var styles = {
				map: {
					height: '300px'
				}
			};
			return _react2['default'].createElement(
				_reactLeaflet.Map,
				{ bounds: bounds, style: styles.map },
				_react2['default'].createElement(_reactLeaflet.TileLayer, {
					url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
					attribution: '© Google 2017 | © <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}),
				_react2['default'].createElement(_reactLeaflet.Polyline, {
					positions: positions,
					color: 'black',
					weight: 14,
					opacity: 0.5
				}),
				_react2['default'].createElement(_reactLeafletDraggablePolyline2['default'], {
					positions: positions,
					waypoints: waypoints,
					onWaypointsChange: this.onWaypointsChange
				})
			);
		}
	}]);

	return App;
})(_react.Component);

;

(0, _reactDom.render)(_react2['default'].createElement(App, null), document.getElementById('app'));

},{"leaflet":undefined,"react":undefined,"react-dom":undefined,"react-leaflet":undefined,"react-leaflet-draggable-polyline":undefined}]},{},[1]);
