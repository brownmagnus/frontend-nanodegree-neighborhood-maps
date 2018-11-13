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

  clickListItem = (index) => {

    this.setState({selectedIndex: index, open: this.state.open})
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDisplay} className="menu-button">
            <i className="fa fa-bars"></i>
          </button>
          <h1>Neighborhood Map</h1>
        </div>
        <div>
          <MapDisplay
            lat={this.state.lat}
            lon={this.state.lon}
            zoom={this.state.zoom}
            locations={this.state.filtered}
            selectedIndex={this.state.selectedIndex}/>
          <ListDisplay
            locations={this.state.filtered}
            open={this.state.open}
            toggleDisplay={this.toggleDisplay}
            filterLocations={this.updateQuery}
            clickListItem={this.clickListItem}/>
        </div>
      </div>

    );
  }
}

export default App;
