import React, { Component } from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';


let mkeyOne = "AIzaSyDJr5qNlchVTKRCK57";
let mkeyTwo = "F_p0RaD7S-8Vt1Z4"
const MAP_KEY = mkeyOne+mkeyTwo;
const FS_CLIENT = "A3GYPEBTVD5FLK0ELVCTSJBXB3LWMGT032U1FBRV3AVCUAFD";
const FS_SECRET = "0D2IWO3HISEIRN2DTA15W4S2EB1QWWD2UMB2BTL2MJARGQUI";
const FS_VERSION = "20180323"

class MapDisplay extends Component {
  state = {
    map: null,
    markers: [],
    markerProps: [],
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false
  };

  componentDidMount = () => {}

  componentWillReceiveProps = (props) => {
    this.setState({firstDrop: false});

    if (this.state.markers.length !== props.locations.length) {
      this.closeInfoWindow();
      this.updateMarkers(props.locations);
      this.setState({activeMarker: null});

      return;
    }

    if (!props.selectedIndex || (this.state.activeMarker &&
    (this.state.markers[props.selectedIndex] !== this.state.activeMarker))) {
      this.closeInfoWindow();
    }

    if (props.selectedIndex === null || typeof(props.selectedIndex)  === "undefined") {
      return;
    };

    this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
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

  getBusinessInfo = (props, data) => {
    //look for matching place data in FourSquare check it with what we have
    return data.response.venues.filter(item => item.name.includes(props.name) || props.name.includes(item.name));
  }

  onMarkerClick = (props, marker, e) => {
    // Close any info window already open
    this.closeInfoWindow();

    // fetch the foursquare data for the selected place
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&ll=${props.position.lat},${props.position.lng}`;
    let headers = new Headers();
    let request = new Request(url, {
      method: 'GET',
      headers
    });

    //Create props for the active marker
    let activeMarkerProps;
    fetch(request)
        .then(response => response.json())
        .then( result => {
          //Get just the business refernce for the place we want irom the foursquare

          let placeIn = this.getBusinessInfo(props, result);
          activeMarkerProps = {
            ...props,
            foursquare:  placeIn[0]
          };

          //Get the list of images for the place if we get any data from foursquare
          if (activeMarkerProps.foursquare) {
            let url = `https://api.foursquare.com/v2/venues/${placeIn[0].id}/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    activeMarkerProps = {
                      ...activeMarkerProps,
                      images: result.response.photos
                    };
                    if(this.state.activeMarker)
                      this.state.activeMarker.setAnimation(null);
                    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                    this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps})
                })
          } else {
            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
            this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps: props})
          }
        })
        // // show clicked marker info InfoWindow
        //marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        //this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps: props})
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
              <h3>{inProps && inProps.street}, {inProps && inProps.city}</h3>
              {inProps && inProps.url
                ? (
                    <a href={inProps.url}>See Website</a>
                  )
                  : ""}
            {inProps && inProps.images
              ? (
                <div>
                  <img alt={inProps.name + " picture"}
                  src={inProps.images.items[0].prefix + "200x200" + inProps.images.items[0].suffix}/>
                    <p>Image from Foursquare</p>
                </div>
              )
              : ""
          }
          </div>
        </InfoWindow>
    </Map>
    )
  }
}

export default GoogleApiWrapper({apiKey: MAP_KEY})(MapDisplay)
