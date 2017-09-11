import React, { Component } from 'react';
import { render } from 'react-dom';
import { Map, Polyline, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import DraggablePolyline from 'react-leaflet-draggable-polyline';


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

	onWaypointsChange(waypoints, index){
		const positions = this.state.positions;
		const allPositions = [
			positions[0][0],
			...waypoints,
			positions[positions.length-1][1]
		];
		this.setState({
			waypoints,
			positions: allPositions.slice(1).map((p, i) =>
				[allPositions[i], p]
			)
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
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
