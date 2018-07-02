import React, { Component } from 'react';
import './App.css';
//import SimpleCard from './SimpleCard';
//import Dropdown from './Dropdown';
//https://stackoverflow.com/questions/40777325/how-to-get-the-key-of-a-selected-value-from-a-dropdown-in-reactjs
import axios from 'axios';



class App extends Component {
  constructor(){
    super()
    this.state = {
       currencylist: [
        {"key": 0, "value": "USD"},
        {"key": 1, "value": "EUR"}
      ],
       coinlist: [{"key": 0, "value:": "Loading..."}],
       amount_to_convert: 0, // this is the amount the user has in a specific coin 
       from_crypto: "", // crypto to convert 
       to_currency: "USD", // currency to convert to 
       show_price_in_currency: false, // toggle to show currency price 
       crypto_price_in_currency: 0, // value of 1 crpyto coin * value in currency converted to 
       crypto_curr_price:0 // price of 1 coin of crypto 
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
      //const coins = Object.keys(res.data.Data)


      // get coin objects then get full coin names 
      const coins_objects = res.data.Data

      let coins_full_name = []
      for (var key in coins_objects) {
        coins_full_name.push(coins_objects[key].FullName)
      }
      
      // add those full coin names to obj 
      coins_full_name.sort().map((currElement, index) => {
        obj.push({"key": index, "value": currElement})
      //console.log("key": index, "value": currElement)
      });


      this.setState({ coinlist: obj });
      })

    }, 1000)
  }


  componentDidMount () {
       this.getData()
  }



  handleChangeCrypto = (e) => {
    console.log(e.target.value);
    var value = this.state.coinlist.filter(function(item) {
      return item.key == e.target.value
    })

    this.setState({from_crypto: value[0].value.match(/\(([^)]+)\)/)[1]})
    //console.log(this.state.from_crypto, ' in handleChangeCrypto');
  }


  handleChangeCurrency = (e) => {
    console.log(e.target.value);
    var value = this.state.currencylist.filter(function(item) {
      return item.key == e.target.value
    })

    this.setState({to_currency: value[0].value })
    //console.log(value[0].value, 'in handleChangeCurrency');
  }


  update_amount_to_convert = (e) => {
    this.setState({amount_to_convert: e.target.value})
    console.log(e.target.value)

  }

  handleClick = () => {

    let crypto = this.state.from_crypto
    let curr = this.state.to_currency
    let amount = this.state.amount_to_convert
    console.log(crypto, curr, amount )
    this.setState({show_price_in_currency: !this.state.show_price_in_currency})

    //'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR'
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=' + crypto + '&tsyms=' + curr 

    axios.get(url)
      .then(res => {
        let curr_to_dollars = res.data[curr] * parseInt(amount)
        console.log(res.data[curr])
        this.setState({crypto_price_in_currency: curr_to_dollars.toLocaleString(), crypto_curr_price: res.data[curr].toLocaleString()})
      })
  }




  render() {


    return (


        <div>

            <form> 

              <h4> <label > Enter an Amount <br />
                <input value={this.state.amount_to_convert} onChange={this.update_amount_to_convert} />
              </label> </h4>

              <h4> <label > From Cryptocurrency <br />
              <select className="crypto-name" onChange={this.handleChangeCrypto}>
                {this.state.coinlist.map(function(data, key){  return (
                  <option key={key} value={data.key}>{data.value}</option> )
                })}
              </select>
              </label> </h4>


              <h4> <label > To Currency <br />
              <select className="current-convert" onChange={this.handleChangeCurrency}>
                {this.state.currencylist.map(function(data, key){  return (
                  <option key={key} value={data.key}>{data.value}</option> )
                })}
              </select>
              </label> </h4>

              <p> 
                <button onClick={this.handleClick} id="submitbutton" type="button">Convert!</button>
              </p>

          </form>

          {!this.state.show_price_in_currency ? null :

          <div> 
            <h4> {this.state.from_crypto} Current Price </h4>
            <label> {this.state.crypto_curr_price} </label>

            <h4> Price in {this.state.to_currency} </h4>
            <label> {this.state.crypto_price_in_currency} </label>
          </div>

          }


        </div>

    );
  }
}

export default App;
