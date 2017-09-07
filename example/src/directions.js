import React, { Component } from 'react';
import { render } from 'react-dom';
import { Map, Polyline, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import DraggablePolyline from 'react-leaflet-draggable-polyline';

const gmaps = window.google.maps;

const flatMap = (lambda, array) =>
	Array.prototype.concat.apply([], array.map(lambda));

const toObjLatLng = latLng =>
	L.latLng(latLng[0], latLng[1]);

const toArrayLatLng = latLng =>
	[latLng.lat, latLng.lng];

const getPositions = response =>
	flatMap(leg =>
		flatMap(step =>
			gmaps.geometry.encoding.decodePath(step.polyline.points).map(
				gLocation => toArrayLatLng(gLocation.toJSON())
			),
			leg.steps
		),
		response.routes[0].legs
	);

const getWaypoints = response =>
	response.routes[0].legs.slice(1).map(
		leg => toArrayLatLng(leg.start_location.toJSON())
	);

class App extends Component {
	constructor(props){
		super(props);

		this.onWaypointsChange = this.onWaypointsChange.bind(this);

		this.state = {
			waypoints: [],
			positions: [
				[43.604403, 1.443373],
				[43.613547, 1.308568]
			]
		};
	}

	componentWillMount(){
		this.getDirections([]);
	}

	onWaypointsChange(waypoints){
		this.getDirections(waypoints);
	}

	getDirections(waypoints){
		const positions = this.state.positions;
		const request = {
			travelMode: window.google.maps.TravelMode.DRIVING,
			origin: toObjLatLng(positions[0]),
			destination: toObjLatLng(positions[positions.length-1]),
			waypoints: waypoints.map(waypoint => ({
				location: toObjLatLng(waypoint),
				stopover: true
			})),
			optimizeWaypoints: true
		};
		const directionsService = new gmaps.DirectionsService();
		directionsService.route(request, (response, status) => {
			if (status === gmaps.DirectionsStatus.OK) {
				this.setState({
					waypoints: getWaypoints(response),
					positions: getPositions(response)
				});
			}
		});
	}


	render () {
		const { waypoints, positions } = this.state;
		const bounds = L.latLngBounds(positions);

		const styles = {
			map: {
				height: '300px'
			}
		};
		return (
			<Map bounds={bounds} style={styles.map}>
				<TileLayer
					url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
					attribution='&copy; Google 2017 | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Polyline
					positions={positions}
					color={'black'}
					weight={14}
					opacity={0.5}
				/>
				<DraggablePolyline
					positions={positions}
					waypoints={waypoints}
					onWaypointsChange={this.onWaypointsChange}
				/>
			</Map>
		);
	}
};

render(<App />, document.getElementById('app'));
