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
      moneyToConvert: "",
      convertedPrice: "",
      showPriceBool: false,
      cryptoCurrentPrice: 0,
      coinlist: [{value: 0, label: "Loading..."}],
      currencylist: [{value: 0, label: "USD"}, {value: 0, label: "EUR"}],
      switchOrder: false
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
      var s = coins_full_name.sort()
      var t = s[0].replace(/\*/g, '').trim()
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


  handleClick1 = () => {




    let amount = this.state.moneyToConvert
    let crypto = this.state.initFromCurrency.label.match(/\(([^)]+)\)/)[1]
    let curr = this.state.initToCurrency.label

    if (!amount) {
      amount = ""
    }
    
    //console.log(crypto, curr, amount )
    this.setState({showPriceBool: true})

    //'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR'
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=' + crypto + '&tsyms=' + curr 


    //console.log(amount)
    if (!this.state.switchOrder) {
      axios.get(url)
        .then(res => {
          let curr_to_dollars = res.data[curr] * amount
          //console.log(res.data[curr])
          this.setState({
            convertedPrice: curr_to_dollars.toLocaleString(), 
            cryptoCurrentPrice: res.data[curr].toLocaleString(),
          })
        })
    } else {
      axios.get(url)
        .then(res => {
          let curr_to_dollars = amount / res.data[curr] 
          console.log(curr_to_dollars)
          this.setState({
            convertedPrice: curr_to_dollars, 
            cryptoCurrentPrice: res.data[curr].toLocaleString(),
          })
        })
    }


  }
  update_amount_to_convert = (e) => {

    // !e.target.value ? 
    // this.setState({moneyToConvert: 0},this.handleClick1) : 
    this.setState({moneyToConvert: parseInt(e.target.value)},this.handleClick1);


  

      

    // .then() -- state not getting updated fast enough 

      

    //console.log(e.target.value)
  }


transfer = () => {
  this.setState({switchOrder: !this.state.switchOrder})
}









  render() {

    var coinlist = this.state.coinlist
    var currencyList = this.state.currencylist


    const FromCryptoCurrency= ({ options }) => {

      if (options) {
        return (
          <div className='search-bar'> 
            <h4 className='dropdown-label-left'>  From Cryptocurrency 
             <Select
              className="from-currency"
              value={this.state.initFromCurrency}
              options={options}
              onChange={this.handleChangeFromCrypto}
              placeholder="From..."
            />
            </h4>
          </div>
          )
      }
      return <div> Loading </div>
    };


    const ToCurrency = ({ options }) => {

      if (options) {
        return (
          <div className='search-bar'> 
            <h4 className='dropdown-label-right'> To Currency  
             <Select
              className="to-currency"
              value={this.state.initToCurrency}
              options={options}
              onChange={this.handleChangeToCurrency}
              placeholder= "...To"
            />
             </h4>
          </div>
          )
      }
      return <div> Loading </div>
    };
   






    return (






      <div> 

        <form> 


        <h4> <label > Enter an Coin Amount <br />
          <input value={this.state.moneyToConvert} type="number" step="0.01" placeholder= "20" onChange={this.update_amount_to_convert} />
        </label> </h4>
        {this.state.switchOrder ? 



          <div className='both-search-bars'>
            <ToCurrency options={currencyList} />
          <FromCryptoCurrency options={coinlist}/>
          
        </div> 

        :
        <div className='both-search-bars'>
          <FromCryptoCurrency options={coinlist}/>
          <ToCurrency options={currencyList} />
        </div>
        }

        <p>
        <button onClick={this.transfer} type="button" class="btn btn-default btn-sm">
          <span class="glyphicon glyphicon-transfer"></span> Transfer 
        </button>
        </p>



{/*  once first conversion is done .. bool can never be false again         */}
        {this.state.showPriceBool == false ? null :

          <div> 
            <h4> {this.state.initFromCurrency.label} Current Price  -- {this.state.moneyToConvert}</h4>
            <label> {this.state.cryptoCurrentPrice} </label>

            <h4> Price in {this.state.initToCurrency.label} </h4>
            <label> {this.state.convertedPrice} </label>
          </div>

          }

        </form>


      </div>


    );
  }
}

export default App;
