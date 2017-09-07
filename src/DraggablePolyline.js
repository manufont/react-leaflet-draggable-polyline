import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Marker, Polyline } from 'react-leaflet';

import { mouseOverWaypointIcon, draggableWaypointIcon } from './icons';
import { snapToPolyline, objectWithoutProperties, toArrayLatLng, toObjLatLng } from './utils';

class DraggablePolyline extends Component {
	constructor(props, context){
		super(props, context);

		this.map = context.map;

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

	onMapMouseMove(event){
		const map = this.map;
		if (this.props.positions && !this.previewHidden) {
			if (!this.onPreviewDrag) {
				const location = snapToPolyline(
					toArrayLatLng(event.latlng),
					this.props.positions
				);
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

	addNewWaypointMarker(location){
		this.removeNewWaypointMarker();
		clearTimeout(this.newWaypointTimeout);
		this.newWaypointTimeout = setTimeout(() => {
			this.newWaypointMarker = L.marker(location, {
				icon: this.props.draggableWaypointIcon || draggableWaypointIcon,
				draggable: true,
				zIndexOffset: 50
			})
			.on('click', this.removeNewWaypointMarker)
			.on('dragend', this.onNewWaypointMarkerDragEnd)
			.on('mouseover', this.hidePreview)
			.on('mouseout', this.showPreview)
			.addTo(this.map);
		}, 5);
	};

	removeNewWaypointMarker(){
		if (this.newWaypointMarker) {
			this.map.removeLayer(this.newWaypointMarker);
			delete this.newWaypointMarker;
		}
	};

	onPreviewMarkerDragStart(event){
		this.onPreviewDrag = true;
	};

	onPreviewMarkerDragEnd(event){
		this.onPreviewDrag = false;
		const newWaypoint = toArrayLatLng(event.target.getLatLng());
		this.removePreviewMarker();
		if(this.props.onWaypointsChange){
			const waypoints = [...this.props.waypoints, newWaypoint];
			this.props.onWaypointsChange(waypoints, waypoints.length - 1);
		}
		if(this.props.onWaypointAdd){
			this.props.onWaypointAdd(newWaypoint);
		}
	};

	onNewWaypointMarkerDragEnd(event){
		const newWaypoint = toArrayLatLng(event.target.getLatLng());
		this.removeNewWaypointMarker();
		if(this.props.onWaypointsChange){
			const waypoints = [...this.props.waypoints, newWaypoint];
			this.props.onWaypointsChange(waypoints, waypoints.length - 1);
		}
		if(this.props.onWaypointAdd){
			this.props.onWaypointAdd(newWaypoint);
		}
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
		this.addNewWaypointMarker(
			snapToPolyline(
				toArrayLatLng(event.latlng),
				this.props.positions
			)
		);
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
	positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
	waypoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

DraggablePolyline.defaultProps = {
	waypoints: [],
	weight: 10
};

export default DraggablePolyline;
