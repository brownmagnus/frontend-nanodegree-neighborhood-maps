import React, { Component } from 'react';

import Drawer from '@material-ui/core/Drawer';

class ListDisplay extends Component {
  state = {
    open: false,
    query: ""
  }

  updateQuery = (newQuery) => {
    this.setState({ query: newQuery });
    this.props.filterLocations(newQuery);
  }

  render = () => {
    return (
      <div>
        <Drawer open={this.props.open} onClose={this.props.toggleDisplay}>
            <div className="list">
              <input
                className="filterEntry"
                  type="text"
                  placeholder="Filter Venues List"
                  name="filter"
                  onChange={e => this.updateQuery(e.target.value)}
                  value={this.state.query} />
              <ul className="no-bullets">
                {this.props.locations && this.props.locations.map((location, index) => {
                    return (
                      <li className="listItem" key={index}>
                          <button onClick={e => this.props.clickListItem(index)} className="listLink" key={index}>{location.name}</button>
                      </li>
                    )
                  })}
              </ul>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default ListDisplay;
