
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
       value: "one", // 
       coinlist: [{value: 0, label: "Loading..."}],
    }
  }


  updateState(element) {
        this.setState({value: element});
      }




  render() {
  var options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
  ];

  var coinlist = this.state.coinlist

    return (

            <Select
        name="form-field-name"
        value={this.state.value}
        options={options}
        onChange={this.updateState.bind(this)}
      />





    );
  }
}

export default App;
