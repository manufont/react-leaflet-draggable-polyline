'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLeaflet = require('react-leaflet');

var _icons = require('./icons');

var _utils = require('./utils');

var DraggablePolyline = (function (_Component) {
	_inherits(DraggablePolyline, _Component);

	function DraggablePolyline(props) {
		_classCallCheck(this, DraggablePolyline);

		_get(Object.getPrototypeOf(DraggablePolyline.prototype), 'constructor', this).call(this, props);

		this.onMapMouseMove = this.onMapMouseMove.bind(this);
		this.removeNewWaypointMarker = this.removeNewWaypointMarker.bind(this);
		this.onPreviewMarkerDragStart = this.onPreviewMarkerDragStart.bind(this);
		this.onPreviewMarkerDragEnd = this.onPreviewMarkerDragEnd.bind(this);
		this.onNewWaypointMarkerDragEnd = this.onNewWaypointMarkerDragEnd.bind(this);
		this.onWaypointClick = this.onWaypointClick.bind(this);
		this.onWaypointDragEnd = this.onWaypointDragEnd.bind(this);
		this.onPolylineClick = this.onPolylineClick.bind(this);
		this.hidePreview = this.hidePreview.bind(this);
		this.showPreview = this.showPreview.bind(this);
	}

	_createClass(DraggablePolyline, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.context.map.on('mousemove', this.onMapMouseMove);
		}
	}, {
		key: 'componentWillUnMount',
		value: function componentWillUnMount() {
			this.context.map.off('mousemove', this.onMapMouseMove);
		}
	}, {
		key: 'getMap',
		value: function getMap() {
			return this.context.map;
		}
	}, {
		key: 'onMapMouseMove',
		value: function onMapMouseMove(event) {
			var map = this.getMap();
			if (this.props.positions && !this.previewHidden) {
				if (!this.onPreviewDrag) {
					var _location = (0, _utils.snapToPolyline)((0, _utils.toArrayLatLng)(event.latlng), this.props.positions);
					var point = map.latLngToContainerPoint((0, _utils.toObjLatLng)(_location));
					if (point.distanceTo(event.containerPoint) > 10) {
						this.removePreviewMarker();
					} else {
						if (this.previewMarker) {
							this.previewMarker.setLatLng(_location);
						} else {
							this.addPreviewMarker(_location);
						}
					}
				}
			} else {
				this.removePreviewMarker();
			}
		}
	}, {
		key: 'addPreviewMarker',
		value: function addPreviewMarker(location) {
			var _this = this;

			clearTimeout(this.previewTimeout);
			this.previewTimeout = setTimeout(function () {
				_this.previewMarker = L.marker(location, {
					icon: _this.props.mouseOverWaypointIcon || _icons.mouseOverWaypointIcon,
					draggable: true
				}).on('dragstart', _this.onPreviewMarkerDragStart).on('dragend', _this.onPreviewMarkerDragEnd).addTo(_this.getMap());
			}, 5);
		}
	}, {
		key: 'removePreviewMarker',
		value: function removePreviewMarker() {
			if (this.previewMarker) {
				this.getMap().removeLayer(this.previewMarker);
				delete this.previewMarker;
			}
		}
	}, {
		key: 'addNewWaypointMarker',
		value: function addNewWaypointMarker(location) {
			var _this2 = this;

			this.removeNewWaypointMarker();
			clearTimeout(this.newWaypointTimeout);
			this.newWaypointTimeout = setTimeout(function () {
				_this2.newWaypointMarker = L.marker(location, {
					icon: _this2.props.draggableWaypointIcon || _icons.draggableWaypointIcon,
					draggable: true,
					zIndexOffset: 50
				}).on('click', _this2.removeNewWaypointMarker).on('dragend', _this2.onNewWaypointMarkerDragEnd).on('mouseover', _this2.hidePreview).on('mouseout', _this2.showPreview).addTo(_this2.getMap());
			}, 5);
		}
	}, {
		key: 'removeNewWaypointMarker',
		value: function removeNewWaypointMarker() {
			if (this.newWaypointMarker) {
				this.getMap().removeLayer(this.newWaypointMarker);
				delete this.newWaypointMarker;
			}
		}
	}, {
		key: 'onPreviewMarkerDragStart',
		value: function onPreviewMarkerDragStart(event) {
			this.onPreviewDrag = true;
		}
	}, {
		key: 'onPreviewMarkerDragEnd',
		value: function onPreviewMarkerDragEnd(event) {
			this.onPreviewDrag = false;
			var newWaypoint = (0, _utils.toArrayLatLng)(event.target.getLatLng());
			this.removePreviewMarker();
			if (this.props.onWaypointsChange) {
				var waypoints = [].concat(_toConsumableArray(this.props.waypoints), [newWaypoint]);
				this.props.onWaypointsChange(waypoints, waypoints.length - 1);
			}
			if (this.props.onWaypointAdd) {
				this.props.onWaypointAdd(newWaypoint);
			}
		}
	}, {
		key: 'onNewWaypointMarkerDragEnd',
		value: function onNewWaypointMarkerDragEnd(event) {
			var newWaypoint = (0, _utils.toArrayLatLng)(event.target.getLatLng());
			this.removeNewWaypointMarker();
			if (this.props.onWaypointsChange) {
				var waypoints = [].concat(_toConsumableArray(this.props.waypoints), [newWaypoint]);
				this.props.onWaypointsChange(waypoints, waypoints.length - 1);
			}
			if (this.props.onWaypointAdd) {
				this.props.onWaypointAdd(newWaypoint);
			}
		}
	}, {
		key: 'onWaypointClick',
		value: function onWaypointClick(event) {
			this.showPreview();
			this.removeNewWaypointMarker();
			var index = event.target.options.options.index;
			if (this.props.onWaypointRemove) {
				var waypoint = this.props.waypoints[index];
				this.props.onWaypointRemove(waypoint, index);
			}
			if (this.props.onWaypointsChange) {
				var waypoints = this.props.waypoints.filter(function (o, i) {
					return i !== index;
				});
				this.props.onWaypointsChange(waypoints);
			}
		}
	}, {
		key: 'onWaypointDragEnd',
		value: function onWaypointDragEnd(marker) {
			var index = marker.target.options.options.index;
			var latLng = (0, _utils.toArrayLatLng)(marker.target.getLatLng());
			this.removePreviewMarker();
			if (this.props.onWaypointMove) {
				this.props.onWaypointMove(latLng, index);
			}
			if (this.props.onWaypointsChange) {
				var waypoints = this.props.waypoints.map(function (o, i) {
					return i === index ? latLng : o;
				});
				this.props.onWaypointsChange(waypoints, index);
			}
		}
	}, {
		key: 'onPolylineClick',
		value: function onPolylineClick(event) {
			this.addNewWaypointMarker((0, _utils.snapToPolyline)((0, _utils.toArrayLatLng)(event.latlng), this.props.positions));
			if (this.props.onclick) {
				this.props.onclick();
			}
		}
	}, {
		key: 'hidePreview',
		value: function hidePreview() {
			this.previewHidden = true;
		}
	}, {
		key: 'showPreview',
		value: function showPreview() {
			this.previewHidden = false;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var waypoints = this.props.waypoints;
			var polylineProps = (0, _utils.objectWithoutProperties)(this.props, customProps);

			return _react2['default'].createElement(
				'g',
				null,
				_react2['default'].createElement(_reactLeaflet.Polyline, _extends({}, polylineProps, {
					onclick: this.onPolylineClick
				})),
				waypoints.map(function (waypoint, index) {
					return _react2['default'].createElement(_reactLeaflet.Marker, {
						key: index,
						position: waypoint,
						icon: _this3.props.draggableWaypointIcon || _icons.draggableWaypointIcon,
						draggable: true,
						ondragend: _this3.onWaypointDragEnd,
						onclick: _this3.onWaypointClick,
						onmouseover: _this3.hidePreview,
						onmouseout: _this3.showPreview,
						zIndexOffset: 50,
						options: { index: index }
					});
				})
			);
		}
	}]);

	return DraggablePolyline;
})(_react.Component);

;

var customProps = ['waypoints', 'onWaypointsChange', 'onWaypointRemove', 'onWaypointAdd', 'onWaypointMove', 'mouseOverWaypointIcon', 'draggableWaypointIcon'];

DraggablePolyline.propTypes = {
	draggableWaypointIcon: _propTypes2['default'].object,
	mouseOverWaypointIcon: _propTypes2['default'].object,
	onWaypointAdd: _propTypes2['default'].func,
	onWaypointMove: _propTypes2['default'].func,
	onWaypointRemove: _propTypes2['default'].func,
	onWaypointsChange: _propTypes2['default'].func,
	onclick: _propTypes2['default'].func,
	positions: _propTypes2['default'].arrayOf(_propTypes2['default'].arrayOf(_propTypes2['default'].number)).isRequired,
	waypoints: _propTypes2['default'].arrayOf(_propTypes2['default'].arrayOf(_propTypes2['default'].number))
};

DraggablePolyline.defaultProps = {
	waypoints: [],
	weight: 10
};

DraggablePolyline.contextTypes = {
	map: _propTypes2['default'].object.isRequired
};

exports.snapToPolyline = _utils.snapToPolyline;
exports['default'] = DraggablePolyline;