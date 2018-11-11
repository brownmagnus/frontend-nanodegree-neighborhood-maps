import React, { Component } from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

const MAP_KEY = "AIzaSyDJr5qNlchVTKRCK57F_p0RaD7S-8Vt1Z4";

class MapDisplay extends Component {
  state = {
    map: null,
    markers: [],
    markerProps: [],
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false
  };

  componentDidMount = () => {
  }

  mapReady = (props, map) => {
    // Save ths map reference in state and prepare the location markers
    this.setState({map});
    this.updateMarkers(this.props.locations)
  }

  closeInfoWindow = () => {
    //close open InfoWindow
    this.state.activeMarker && this
        .state
        .activeMarker
        .setAnimation(null);
    this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProps: null})
  }

  onMarkerClick = (props, marker, e) => {
    // Close any info window already open
    this.closeInfoWindow();

    // show clicked marker info InfoWindow
    this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps: props})
  }

  updateMarkers = (locations) => {
    // check if there is data in locations
    if (!locations)
        return;

    // Clear any existing markers on the maps
    this
        .state
        .markers
        .forEach(marker => marker.setMap(null));

    let markerProps = [];
    let markers = locations.map((location, index) => {
      let mProps = {
        key: index,
        index,
        name: location.name,
        street: location.street,
        city: location.city,
        position: location.pos,
        url: location.url
      };
      markerProps.push(mProps);

      let animation = this.props.google.maps.Animation.DROP;
      let marker = new this.props.google.maps.Marker({
        position: location.pos,
        map: this.state.map,
        animation
      });
      marker.addListener('click', () => {
        this.onMarkerClick(mProps, marker, null);
      });
      return marker;
    })

    this.setState({markers, markerProps});
  }

  render = () => {
  const style = {
    width: '100%',
    height: '100%'
  }
  const center = {
    lat: this.props.lat,
    lng: this.props.lon
  }
  let inProps = this.state.activeMarkerProps;

  return (
    <Map role="application"
      aria-label="map"
      onReady={this.mapReady}
      google={this.props.google}
      zoom={this.props.zoom}
      style={style}
      initialCenter={center}
      onClick={this.closeInfoWindow}>
      <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.closeInfoWindow}>
          <div>
              <h3>{inProps && inProps.name}</h3>
              <h3>{inProps && inProps.street},{inProps && inProps.city}</h3>
              {inProps && inProps.url ? (
                <a href={inProps.url}>See Website</a>
              )
            : ""}
          </div>
        </InfoWindow>
    </Map>

    );
  }
}

export default GoogleApiWrapper({apiKey: MAP_KEY})(MapDisplay)
