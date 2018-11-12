import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDisplay from './components/ListDisplay';

class App extends Component {
  state = {
    lat: 38.963166 ,
    lon: -76.9353225,
    zoom: 13,
    all: locations,
    filtered: null,
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

  componentDidMount = () => {
    this.setState({
      ...this.setState,
      filtered: this.filterLocations(this.state.all, "")
    });
  }

  toggleDisplay = () => {
    // Toggle the source of true value for the drawer display
    this.setState({
      open: !this.state.open
    });
  }

  updateQuery = (query) => {
    // Update the query value and filter the list of locations
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterLocations(this.state.all, query)
    });
  }

  filterLocations = (locations, query) => {
    // Filter location to match string query
    return locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
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
            locations={this.state.filtered}/>
          <ListDisplay
            locations={this.state.filtered}
            open={this.state.open}
            toggleDisplay={this.toggleDisplay}
            filterLocations={this.updateQuery}/>
        </div>
      </div>

    );
  }
}

export default App;
