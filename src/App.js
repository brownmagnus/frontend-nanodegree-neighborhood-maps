import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';

class App extends Component {
  state = {
    lat: 38.963166 ,
    lon: -76.9353225,
    zoom: 13,
    all: locations,
    open: false
  }

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      backgroud: "white",
      padding: 10
    },
    hide: {
      display: "none"
    },
    header: {
      marginTop: "0px"
    }
  };

  toggleDisplay = () => {
    this.setState({
      open: !this.state.open
    });
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDisplay} style={this.styles.menuButton}>
            <i className="fa fa-bars"></i>
          </button>
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
