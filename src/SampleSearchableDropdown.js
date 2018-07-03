
import React, { Component } from 'react';
import './App.css';
//import SimpleCard from './SimpleCard';
//import Dropdown from './Dropdown';
//https://stackoverflow.com/questions/40777325/how-to-get-the-key-of-a-selected-value-from-a-dropdown-in-reactjs
import axios from 'axios';
//import Select from 'react-virtualized-select';
import Select from 'react-select';

import 'react-select/dist/react-select.css';
//import ' react-virtualized/styles.css'
//import 'react-virtualized-select/styles.css'





class App extends Component {


    constructor(){
    super()
    this.state = {
       opts1: []
    }
  }







  render() {
    const opts = [{ label: 'any', value: 1 }, { label: 'Two', value: 2 }];

    const PortfolioSelector = ({ options }) => {
      if (options) {
        return (
          <div className="portfolio select-box">
            <label htmlFor="selectBox" className="select-box__label">
              Portfolio
            </label>
            <div className="select-box__container">
              <Select
                id="portf"
                options={options}
                value={this.state.opts1}
                onChange={value => this.setState({ opts1: value })}
                placeholder="Select Portfolio" />
            </div>
            <div className="separator" />
          </div>
        );
      }
      return <div>Loading</div>;
    };


    return (




      <div> 

      <PortfolioSelector options={opts} />
    </div>

    );
  }
}

export default App;
