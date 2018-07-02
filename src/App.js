import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import SimpleCard from './SimpleCard';
import Dropdown from './Dropdown';



class App extends Component {
  constructor(){
    super()
    this.state = {
      location: [
        {
            id: 0,
            title: 'New York',
            selected: false,
            key: 'location'
        },
        {
          id: 1,
          title: 'Dublin',
          selected: false,
          key: 'location'
        },
        {
          id: 2,
          title: 'California',
          selected: false,
          key: 'location'
        },
        {
          id: 3,
          title: 'Istanbul',
          selected: false,
          key: 'location'
        },
        {
          id: 4,
          title: 'Izmir',
          selected: false,
          key: 'location'
        },
        {
          id: 5,
          title: 'Oslo',
          selected: false,
          key: 'location'
        }
      ]
    }
  }





  render() {
    return (
      <div className="App">
        <Dropdown
          title="Select location"
          list={this.state.location}
        />
      </div>
    );
  }
}

export default App;
