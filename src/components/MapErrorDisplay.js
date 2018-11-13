import React, { Component } from 'react';

class MapErrorDisplay extends Component {
  state = {
    show: false,
    timeout: null
  }

  componentDidMount = () => {
    let timeout = window.setTimeout(this.showMessage, 1000);
    this.setState({timeout})
  }

  componentWillUnmont = () => {
    window.clearTimeout(this.state.timeout);
  }

  showMessage = () => {
    this.setState({show: true});
  }

  render = () => {
    return (
      <div>
          {this.state.show
            ? (
                <div>
                  <h1>Error loading map</h1>
                  <p>
                    Please we could not load map control due to a network error.
                    Try agian!
                  </p>
                </div>
            )
            : (
                <div>
                  <h1>Loading....</h1>
                </div>
            )
          } </div>
    )
  }
}

export default MapErrorDisplay;
