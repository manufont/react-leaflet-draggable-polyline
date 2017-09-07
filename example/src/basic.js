import React, { Component } from 'react';
import { render } from 'react-dom';
import { Map, Polyline, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import DraggablePolyline from '../../src/DraggablePolyline';


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

	onWaypointsChange(waypoints, index){
		const positions = this.state.positions;
		this.setState({
			waypoints,
			positions: [
				positions[0],
				...waypoints,
				positions[positions.length-1]
			]
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
