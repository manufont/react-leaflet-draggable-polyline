import React, { Component } from 'react';
import { render } from 'react-dom';
import { Map, Polyline, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import DraggablePolyline from 'react-leaflet-draggable-polyline';

const gmaps = window.google.maps;

const flatten = array =>
	Array.prototype.concat.apply([], array);

const last = array =>
	array[array.length-1];

const toObjLatLng = latLng =>
	L.latLng(latLng[0], latLng[1]);

const toArrayLatLng = latLng =>
	[latLng.lat, latLng.lng];

const getPositions = response =>
	response.routes[0].legs.map(leg =>
		flatten(
			leg.steps.map(step =>
				gmaps.geometry.encoding.decodePath(step.polyline.points).map(
					gLocation => toArrayLatLng(gLocation.toJSON())
				)
			)
		)
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
				[
					[43.604403, 1.443373],
					[43.613547, 1.308568]
				]
			]
		};
	}

	componentWillMount(){
		this.getDirections([]);
	}

	onWaypointsChange(waypoints, index){
		const zoom = this.map.leafletElement.getZoom();
		this.getDirections(waypoints, index, zoom);
	}

	getDirections(waypoints, snapIndex, zoom){
		const positions = this.state.positions;
		const request = {
			travelMode: window.google.maps.TravelMode.DRIVING,
			origin: toObjLatLng(positions[0][0]),
			destination: toObjLatLng(last(last(positions))),
			waypoints: waypoints.map(waypoint => ({
				location: toObjLatLng(waypoint),
				stopover: true
			})),
			...(snapIndex !== undefined) && {
				Df: 3,
				tc: snapIndex+1,
				Xe: zoom
				//This is an undocumented feature of DirectionsService.
				//It snaps the new waypoint to the nearest biggest road.
				//those keys are linked to gmaps api v3.28.19. You can reverse-engineer any version by using a DirectionsRenderer here https://jsfiddle.net/r98npvx0/3/
			}
		};
		console.log(request);
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
		const flattenPositions = flatten(positions);
		const bounds = L.latLngBounds(flattenPositions);

		const styles = {
			map: {
				height: '300px'
			}
		};

		return (
			<Map bounds={bounds} style={styles.map} ref={m => this.map = m}>
				<TileLayer
					url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
					attribution='&copy; Google 2017 | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Polyline
					positions={flattenPositions}
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
