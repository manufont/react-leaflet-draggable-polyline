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

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _icons = require('./icons');

var _utils = require('./utils');

var DraggablePolyline = (function (_Component) {
	_inherits(DraggablePolyline, _Component);

	function DraggablePolyline(props, context) {
		_classCallCheck(this, DraggablePolyline);

		_get(Object.getPrototypeOf(DraggablePolyline.prototype), 'constructor', this).call(this, props, context);

		this.map = context.map;
		this.validProps(props);
		this.setPositions(props.positions);

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
			this.map.on('mousemove', this.onMapMouseMove);
		}
	}, {
		key: 'componentWillUnMount',
		value: function componentWillUnMount() {
			this.map.off('mousemove', this.onMapMouseMove);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(props) {
			this.validProps(props);
			this.setPositions(props.positions);
		}
	}, {
		key: 'validProps',
		value: function validProps(props) {
			if (props.positions.length === 0) {
				throw new Error('Positions array should not be empty');
			}
			if (props.positions[0][0].constructor === Array) {
				props.positions.forEach(function (leg) {
					if (leg.length < 2) {
						throw new Error('Positions array should contains at least 2 positions');
					}
				});
				if (props.positions.length !== props.waypoints.length + 1) {
					throw new Error('Positions legs length should be equal to waypoints length + 1');
				}
			} else {
				if (props.positions.length < 2) {
					throw new Error('Positions array should contains at least 2 positions');
				}
			}
		}
	}, {
		key: 'snapToPolyline',
		value: function snapToPolyline(position) {
			return (0, _utils.snapToPolyline)(position, this.positions);
		}
	}, {
		key: 'closestIndexOfPolyline',
		value: function closestIndexOfPolyline(position) {
			return (0, _utils.closestIndexOfPolyline)(position, this.positions);
		}
	}, {
		key: 'setPositions',
		value: function setPositions(positions) {
			var _this = this;

			this.positionIndexes = [];
			if (positions[0][0].constructor === Array) {
				(function () {
					var indexes = 0;
					positions.forEach(function (leg) {
						indexes += leg.length;
						_this.positionIndexes.push(indexes);
					});
					_this.positions = (0, _utils.flatten)(positions);
				})();
			} else {
				this.positions = positions;
			}
		}
	}, {
		key: 'onMapMouseMove',
		value: function onMapMouseMove(event) {
			var map = this.map;
			if (!this.previewHidden) {
				if (!this.onPreviewDrag) {
					var _location = this.snapToPolyline((0, _utils.toArrayLatLng)(event.latlng));
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
			var _this2 = this;

			clearTimeout(this.previewTimeout);
			this.previewTimeout = setTimeout(function () {
				_this2.previewMarker = _leaflet2['default'].marker(location, {
					icon: _this2.props.mouseOverWaypointIcon || _icons.mouseOverWaypointIcon,
					draggable: true
				}).on('dragstart', _this2.onPreviewMarkerDragStart).on('dragend', _this2.onPreviewMarkerDragEnd).addTo(_this2.map);
			}, 5);
		}
	}, {
		key: 'removePreviewMarker',
		value: function removePreviewMarker() {
			if (this.previewMarker) {
				this.map.removeLayer(this.previewMarker);
				delete this.previewMarker;
			}
		}
	}, {
		key: 'removeNewWaypointMarker',
		value: function removeNewWaypointMarker() {
			if (this.newWaypointMarker) {
				this.map.removeLayer(this.newWaypointMarker);
				delete this.newWaypointMarker;
			}
		}
	}, {
		key: 'getIndex',
		value: function getIndex(positionIndex) {
			var index = this.positionIndexes.findIndex(function (index) {
				return positionIndex < index;
			});
			if (index === -1) return null;
			return index;
		}
	}, {
		key: 'onWaypointAdded',
		value: function onWaypointAdded(newWaypoint, index) {
			if (this.props.onWaypointsChange) {
				var waypoints = index === undefined ? [].concat(_toConsumableArray(this.props.waypoints), [newWaypoint]) : [].concat(_toConsumableArray(this.props.waypoints.slice(0, index)), [newWaypoint], _toConsumableArray(this.props.waypoints.slice(index)));
				this.props.onWaypointsChange(waypoints, index);
			}
			if (this.props.onWaypointAdd) {
				this.props.onWaypointAdd(newWaypoint, index);
			}
		}
	}, {
		key: 'onPreviewMarkerDragStart',
		value: function onPreviewMarkerDragStart(event) {
			var closestIndex = this.closestIndexOfPolyline((0, _utils.toArrayLatLng)(event.target.getLatLng()));
			_leaflet2['default'].Util.setOptions(this.previewMarker, {
				index: this.getIndex(closestIndex)
			});
			this.previewMarker.setZIndexOffset(100);
			this.onPreviewDrag = true;
		}
	}, {
		key: 'onPreviewMarkerDragEnd',
		value: function onPreviewMarkerDragEnd(event) {
			this.onPreviewDrag = false;
			var newWaypoint = (0, _utils.toArrayLatLng)(event.target.getLatLng());
			var index = event.target.options.index;
			this.removePreviewMarker();
			this.onWaypointAdded(newWaypoint, index);
		}
	}, {
		key: 'onNewWaypointMarkerDragEnd',
		value: function onNewWaypointMarkerDragEnd(event) {
			var newWaypoint = (0, _utils.toArrayLatLng)(event.target.getLatLng());
			this.removeNewWaypointMarker();
			var index = event.target.options.options.index;
			this.onWaypointAdded(newWaypoint, index);
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
			var _this3 = this;

			var closestIndex = this.closestIndexOfPolyline((0, _utils.toArrayLatLng)(event.latlng));
			var location = this.snapToPolyline((0, _utils.toArrayLatLng)(event.latlng));
			this.removeNewWaypointMarker();
			clearTimeout(this.newWaypointTimeout);
			this.newWaypointTimeout = setTimeout(function () {
				_this3.newWaypointMarker = _leaflet2['default'].marker(location, {
					icon: _this3.props.draggableWaypointIcon || _icons.draggableWaypointIcon,
					draggable: true,
					zIndexOffset: 50,
					options: {
						index: _this3.getIndex[closestIndex]
					}
				}).on('click', _this3.removeNewWaypointMarker).on('dragend', _this3.onNewWaypointMarkerDragEnd).on('mouseover', _this3.hidePreview).on('mouseout', _this3.showPreview).addTo(_this3.map);
			}, 5);
			if (this.props.onclick) {
				this.props.onclick();
			}
		}
	}, {
		key: 'hidePreview',
		value: function hidePreview() {
			this.previewHidden = true;
			this.onPreviewDrag = false;
		}
	}, {
		key: 'showPreview',
		value: function showPreview() {
			this.previewHidden = false;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			var waypoints = this.props.waypoints;
			var polylineProps = (0, _utils.objectWithoutProperties)(this.props, customProps);

			return _react2['default'].createElement(
				'g',
				null,
				_react2['default'].createElement(_reactLeaflet.Polyline, _extends({
					positions: this.positions
				}, polylineProps, {
					onclick: this.onPolylineClick
				})),
				waypoints.map(function (waypoint, index) {
					return _react2['default'].createElement(_reactLeaflet.Marker, {
						key: index,
						position: waypoint,
						icon: _this4.props.draggableWaypointIcon || _icons.draggableWaypointIcon,
						draggable: true,
						ondragend: _this4.onWaypointDragEnd,
						onclick: _this4.onWaypointClick,
						onmouseover: _this4.hidePreview,
						onmouseout: _this4.showPreview,
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

var customProps = ['positions', 'waypoints', 'onWaypointsChange', 'onWaypointRemove', 'onWaypointAdd', 'onWaypointMove', 'mouseOverWaypointIcon', 'draggableWaypointIcon'];

DraggablePolyline.contextTypes = {
	map: _propTypes2['default'].object.isRequired
};

DraggablePolyline.propTypes = {
	draggableWaypointIcon: _propTypes2['default'].object,
	mouseOverWaypointIcon: _propTypes2['default'].object,
	onWaypointAdd: _propTypes2['default'].func,
	onWaypointMove: _propTypes2['default'].func,
	onWaypointRemove: _propTypes2['default'].func,
	onWaypointsChange: _propTypes2['default'].func,
	onclick: _propTypes2['default'].func,
	positions: _propTypes2['default'].oneOfType([_propTypes2['default'].arrayOf(_propTypes2['default'].arrayOf(_propTypes2['default'].number)), _propTypes2['default'].arrayOf(_propTypes2['default'].arrayOf(_propTypes2['default'].arrayOf(_propTypes2['default'].number)))]).isRequired,
	waypoints: _propTypes2['default'].arrayOf(_propTypes2['default'].arrayOf(_propTypes2['default'].number))
};

DraggablePolyline.defaultProps = {
	waypoints: [],
	weight: 10
};

exports['default'] = DraggablePolyline;
module.exports = exports['default'];