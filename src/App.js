import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';

class App extends Component {
  state = {
    lat: 38.963166 ,
    lon: -76.9353225,
    zoom: 13,
    all: locations
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <h1>Brownia's Neighborhood Map</h1>
        </div>
        <div>
          <MapDisplay
            lat={this.state.lat}
            lon={this.state.lon}
            zoom={this.state.zoom}
            locations={this.state.all}/>
        </div>
      </div>

    );
  }
}

export default App;
