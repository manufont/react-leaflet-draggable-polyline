import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

import { mouseOverWaypointIcon, draggableWaypointIcon } from './icons';
import {
	flatten,
	snapToPolyline,
	closestOfPolyline,
	objectWithoutProperties,
	toArrayLatLng,
	toObjLatLng
} from './utils';

class DraggablePolyline extends Component {
	constructor(props, context){
		super(props, context);

		this.map = context.map;
		this.fetchPositions(props.positions);

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

	componentWillMount(){
		this.map.on('mousemove', this.onMapMouseMove);
	}

	componentWillUnMount(){
		this.map.off('mousemove', this.onMapMouseMove);
	}

	componentWillReceiveProps(props){
		this.fetchPositions(props.positions);
	}

	snapToPolyline(position){
		return snapToPolyline(position, this.positions);
	}

	closestOfPolyline(position){
		return closestOfPolyline(position, this.positions);
	}

	fetchPositions(positions){
		this.positionsMap = {};
		if(positions[0][0].constructor === Array){
			positions.forEach((leg, index) => {
				leg.forEach(position => {
					this.positionsMap[position.join(',')] = index;
				});
			});
			this.positions = flatten(positions);
			this.positions = this.positions.filter((position, index) => 
				index === 0 ||
				position[0] !== this.positions[index-1][0] ||
				position[1] !== this.positions[index-1][1]
			);
		}else{
			this.positions = positions;
		}
	};

	onMapMouseMove(event){
		const map = this.map;
		if (!this.previewHidden) {
			if (!this.onPreviewDrag) {
				const location = this.snapToPolyline(toArrayLatLng(event.latlng));
				const point = map.latLngToContainerPoint(toObjLatLng(location));
				if (point.distanceTo(event.containerPoint) > 10) {
					this.removePreviewMarker();
				} else {
					if (this.previewMarker) {
						this.previewMarker.setLatLng(location);
					} else {
						this.addPreviewMarker(location);
					}
				}
			}
		} else {
			this.removePreviewMarker();
		}
	};

	addPreviewMarker(location){
		clearTimeout(this.previewTimeout);
		this.previewTimeout = setTimeout(() => {
			this.previewMarker = L.marker(location, {
				icon: this.props.mouseOverWaypointIcon || mouseOverWaypointIcon,
				draggable: true
			})
			.on('dragstart', this.onPreviewMarkerDragStart)
			.on('dragend', this.onPreviewMarkerDragEnd)
			.addTo(this.map);
		}, 5);
	};

	removePreviewMarker(){
		if (this.previewMarker) {
			this.map.removeLayer(this.previewMarker);
			delete this.previewMarker;
		}
	};

	removeNewWaypointMarker(){
		if (this.newWaypointMarker) {
			this.map.removeLayer(this.newWaypointMarker);
			delete this.newWaypointMarker;
		}
	};

	onPreviewMarkerDragStart(event){
		const location = this.closestOfPolyline(toArrayLatLng(event.target.getLatLng()));
		L.Util.setOptions(this.previewMarker, {
			index: this.positionsMap[location.join(',')]
		});
		this.onPreviewDrag = true;
	};

	onWaypointAdded(newWaypoint, realIndex){
		if(this.props.onWaypointsChange){
			const index = realIndex === undefined ? 0 : realIndex;
			const waypoints = [
				...this.props.waypoints.slice(0, index),
				newWaypoint,
				...this.props.waypoints.slice(index)
			];
			this.props.onWaypointsChange(waypoints, realIndex);
		}
		if(this.props.onWaypointAdd){
			this.props.onWaypointAdd(newWaypoint);
		}
	}

	onPreviewMarkerDragEnd(event){
		this.onPreviewDrag = false;
		const newWaypoint = toArrayLatLng(event.target.getLatLng());
		const index = event.target.options.index;
		this.removePreviewMarker();
		this.onWaypointAdded(newWaypoint, index);
	};

	onNewWaypointMarkerDragEnd(event){
		const newWaypoint = toArrayLatLng(event.target.getLatLng());
		this.removeNewWaypointMarker();
		const index = event.target.options.options.index;
		this.onWaypointAdded(newWaypoint, index);
	};

	onWaypointClick(event){
		this.showPreview();
		this.removeNewWaypointMarker();
		const index = event.target.options.options.index;
		if(this.props.onWaypointRemove){
			const waypoint = this.props.waypoints[index];
			this.props.onWaypointRemove(waypoint, index);
		}
		if(this.props.onWaypointsChange){
			const waypoints = this.props.waypoints.filter((o, i) => i !== index);
			this.props.onWaypointsChange(waypoints);
		}
	};

	onWaypointDragEnd(marker){
		const index = marker.target.options.options.index;
		const latLng = toArrayLatLng(marker.target.getLatLng());
		this.removePreviewMarker();
		if(this.props.onWaypointMove){
			this.props.onWaypointMove(latLng, index);
		}
		if(this.props.onWaypointsChange){
			const waypoints = this.props.waypoints.map(
				(o, i) => (i === index ? latLng : o)
			);
			this.props.onWaypointsChange(waypoints, index);
		}
	};

	onPolylineClick(event){
		const closest = this.closestOfPolyline(toArrayLatLng(event.latlng));
		const location = this.snapToPolyline(toArrayLatLng(event.latlng));
		this.removeNewWaypointMarker();
		clearTimeout(this.newWaypointTimeout);
		this.newWaypointTimeout = setTimeout(() => {
			this.newWaypointMarker = L.marker(location, {
				icon: this.props.draggableWaypointIcon || draggableWaypointIcon,
				draggable: true,
				zIndexOffset: 50,
				options: {
					index: this.positionsMap[closest.join(',')]
				}
			})
			.on('click', this.removeNewWaypointMarker)
			.on('dragend', this.onNewWaypointMarkerDragEnd)
			.on('mouseover', this.hidePreview)
			.on('mouseout', this.showPreview)
			.addTo(this.map);
		}, 5);
		if(this.props.onclick){
			this.props.onclick();
		}
	};

	hidePreview(){
		this.previewHidden = true;
	}

	showPreview(){
		this.previewHidden = false;
	}

	render () {
		const waypoints = this.props.waypoints;
		const polylineProps = objectWithoutProperties(this.props, customProps);

		return (
			<g>
				<Polyline
					positions={this.positions}
					{...polylineProps}
					onclick={this.onPolylineClick}
				/>
				{waypoints.map((waypoint, index) =>
					<Marker
						key={index}
						position={waypoint}
						icon={this.props.draggableWaypointIcon || draggableWaypointIcon}
						draggable
						ondragend={this.onWaypointDragEnd}
						onclick={this.onWaypointClick}
						onmouseover={this.hidePreview}
						onmouseout={this.showPreview}
						zIndexOffset={50}
						options={{ index }}
					/>
				)}
			</g>
		);
	}
};

const customProps = [
	'positions',
	'waypoints',
	'onWaypointsChange',
	'onWaypointRemove',
	'onWaypointAdd',
	'onWaypointMove',
	'mouseOverWaypointIcon',
	'draggableWaypointIcon',
];

DraggablePolyline.contextTypes = {
	map: PropTypes.object.isRequired
};

DraggablePolyline.propTypes = {
	draggableWaypointIcon: PropTypes.object,
	mouseOverWaypointIcon: PropTypes.object,
	onWaypointAdd: PropTypes.func,
	onWaypointMove: PropTypes.func,
	onWaypointRemove: PropTypes.func,
	onWaypointsChange: PropTypes.func,
	onclick: PropTypes.func,
	positions: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
		PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)))
	]).isRequired,
	waypoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

DraggablePolyline.defaultProps = {
	waypoints: [],
	weight: 10
};

export default DraggablePolyline;
