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

  constructor(props) {
    super(props);
    this.state = {
      initFromCurrency: "",
      initToCurrency: "",
      moneyToConvert: 0,
      convertedPrice: 0,
      showPriceBool: false,
      cryptoCurrentPrice: 0,
      coinlist: [{value: 0, label: "Loading..."}],
      currencylist: [{value: 0, label: "USD"}, {value: 0, label: "EUR"}]
     }
   }


  componentWillMount(){
    console.log('First this called');
  }


  getData(){
    let obj = []
    setTimeout(() => {
      console.log('Our data is fetched');
      axios.get('https://www.cryptocompare.com/api/data/coinlist/')
      .then(res => {

      // get coin objects then get full coin names 
      const coins_objects = res.data.Data

      let coins_full_name = []
      for (var key in coins_objects) {
        coins_full_name.push(coins_objects[key].FullName)
      }
      console.log(coins_full_name)

      
      // add those full coin names to obj 
      coins_full_name.sort().map((currElement, index) => {
        obj.push({value: index, label: currElement.replace(/\*/g, '').trim()})
        //console.log("key",index, "value", currElement)
      });

      this.setState({ coinlist: obj });
      })

    }, 1000)
  }


  componentDidMount () {
    this.getData()
  }

  handleChangeFromCrypto = (element) => {
    this.setState({initFromCurrency: element  }); 
    // if you do element.label then list item chosen won't appear in text box... 
  }

  handleChangeToCurrency= (element) => {
    this.setState({initToCurrency: element});
    // if you do element.label then list item chosen won't appear in text box... 
  }

  update_amount_to_convert = (e) => {
    this.setState({moneyToConvert: e.target.value})
    //console.log(e.target.value)
  }

  handleClick = () => {

    let crypto = this.state.initFromCurrency.label.match(/\(([^)]+)\)/)[1]
    let curr = this.state.initToCurrency.label
    let amount = this.state.moneyToConvert
    console.log(crypto, curr, amount )
    this.setState({showPriceBool: true})

    //'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR'
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=' + crypto + '&tsyms=' + curr 

    axios.get(url)
      .then(res => {
        let curr_to_dollars = res.data[curr] * parseInt(amount)
        console.log(res.data[curr])
        this.setState({convertedPrice: curr_to_dollars.toLocaleString(), cryptoCurrentPrice: res.data[curr].toLocaleString()})
      })
  }








  render() {

    var coinlist = this.state.coinlist
    var currencyList = this.state.currencylist


    const FromCryptoCurrency= ({ options }) => {

      if (options) {
        return (
          <h4> <label > From Cryptocurrency <br /> 
           <Select
            name="form-field-name"
            value={this.state.initFromCurrency}
            options={options}
            onChange={this.handleChangeFromCrypto}
            placeholder="From..."
          />

          </label> </h4>
          )
      }
      return <div> Loading </div>
    };


    const ToCurrency = ({ options }) => {

      if (options) {
        return (
          <h4> <label > To Currency <br /> 
           <Select
            name="form-field-name"
            value={this.state.initToCurrency}
            options={options}
            onChange={this.handleChangeToCurrency}
            placeholder= "...To"
          />

          </label> </h4>
          )
      }
      return <div> Loading </div>
    };
   






    return (






      <div> 

        <h4> <label > Enter an Amount <br />
          <input value={this.state.moneyToConvert} onChange={this.update_amount_to_convert} />
        </label> </h4>


        <FromCryptoCurrency options={coinlist}/>
        <ToCurrency options={currencyList} />

        <p> 
          <button onClick={this.handleClick} id="submitbutton" type="button">Convert!</button>
        </p>

{/*  once first conversion is done .. bool can never be false again         */}
        {this.state.showPriceBool == false ? null :

          <div> 
            <h4> {this.state.initFromCurrency.label} Current Price </h4>
            <label> {this.state.cryptoCurrentPrice} </label>

            <h4> Price in {this.state.initToCurrency.label} </h4>
            <label> {this.state.convertedPrice} </label>
          </div>

          }


      </div>


    );
  }
}

export default App;
