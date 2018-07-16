import React, { Component } from 'react';
import './App.css';
//import SimpleCard from './SimpleCard';
//import Dropdown from './Dropdown';
//https://stackoverflow.com/questions/40777325/how-to-get-the-key-of-a-selected-value-from-a-dropdown-in-reactjs
import axios from 'axios';
//import Select from 'react-virtualized-select';
import Select from 'react-select';
import {Line} from 'react-chartjs-2';

import 'react-select/dist/react-select.css';
//import ' react-virtualized/styles.css'
//import 'react-virtualized-select/styles.css'

  const monthsDict = {
    1: 31,
    2: 28, 
    3: 31,
    4: 30,
    5: 31,
    6: 30, 
    7: 31,
    8: 31,
    9: 30,
    10: 31, 
    11: 30,
    12: 31
  }

  let monthNamesDict = {
    1: 'January', 
    2: 'February', 
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initFromCurrency: "",
      initToCurrency: "",
      moneyToConvert: 0,
      convertedPrice: 0,
      cryptoCurrentPrice: 0,
      coinlist: [{value: 0, label: "Loading..."}],
      currencylist: [{value: 0, label: "USD"}, {value: 0, label: "EUR"}],
      plotData: [],
      boolz: false,
      dateRange: [],
      inputValue:"",
      flipDropdown: false 
     }
   }


  componentWillMount(){
    console.log('First this called');
  }


  getPrev30Days = (dateStr, currYear) => {
  // get previous 30 days from today's date 
  // TAKE ARG FORMATTED LIKE '6 2' AND CHANGES IT TO '06 02' and returns array of previous 30 days depending on month 

    let month = dateStr.split(' ')[0] * 1
    let prevMonth = month -1
    let currDay = dateStr.split(' ')[1] * 1

    // number of days in current month
    let daysInCurrMonth = monthsDict[month]
    //30

    // number of days to subtract from the end of the previous month 
    let daysToTake = daysInCurrMonth - currDay
      //5

    // number of days in previous month 
    let daysInPrevMonth = monthsDict[prevMonth]
    //31

     
    //most important -- what day in previous month to start at 
    let prevMonthStartDate = daysInPrevMonth - daysToTake
      //26

    //console.log(daysToTake, prevMonthStartDate, daysInPrevMonth, daysInCurrMonth)

    if (month.toString().length === 1 ){
      month = '0'+ month.toString()
    }

    //const prevMonth = ""
    if (prevMonth.toString().length === 1 ){
      prevMonth = '0'+ prevMonth.toString()
    }

      // this is an array of days from previous month starting in the middle 
    let prevMonthDaysArr = []
    for (var i=prevMonthStartDate; i < daysInPrevMonth; i++) {

      // to add 0 to singel digit #'s '
      const elem = i.toString()
      if (elem.length === 1) {
        const monthDate = `${currYear}.${prevMonth}.0${i}`
        prevMonthDaysArr.push(monthDate)
      }
      else {
        const monthDate = `${currYear}.${prevMonth}.${i}`
        prevMonthDaysArr.push(monthDate)
      }
    }

    let currMonthDaysArr = []
    for (var j=1; j <= currDay; j++) {
      const elem = j.toString()
      if (elem.length == 1) {
        let monthDate = `${currYear}.${month}.0${j}`
        currMonthDaysArr.push(monthDate)
      } else {
        let monthDate = `${currYear}.${month}.${j}`
        currMonthDaysArr.push(monthDate)
      }
    }

    let bothMonths = prevMonthDaysArr.concat(currMonthDaysArr)

    let finalArr = []; 

    for (var k=0; k < bothMonths.length-1; k++) {
      if (k %  2 !== 0 ){
        finalArr.push(bothMonths[k]) 
      }
    }

    return finalArr
  }



  formatTitle = (finalArr, firstOrLastDay) => {
    // finalArr is array of unix timestamps to be plotted 
    // firstOrLastDay is 'first' or 'last'

    let whichDate = 0
    if (firstOrLastDay === 'first') {
      whichDate = 0
    }
    if (firstOrLastDay === 'last') {
      whichDate = finalArr.length-1
    }

    let firstDayUnix = finalArr[whichDate]
    let lastDayUnix = finalArr[whichDate]


    let firstDayUnixYear = firstDayUnix.split('.')[0]
    let firstDayUnixMonth = firstDayUnix.split('.')[1]
    let firstDayUnixDay = firstDayUnix.split('.')[2]

    let firstDayMonthName = monthNamesDict[firstDayUnixMonth * 1]

    let finalFirstDate = `${firstDayMonthName} ${firstDayUnixDay}, ${firstDayUnixYear}`

    return finalFirstDate
  }



  requestPlotData = (unixFormat, plotTitle) => {

    let coin = this.state.inputValue
    let url = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + coin + '&tsyms=USD,EUR&ts='

    let labelsArr = []
    let pricesArr = []


    for (var i=0; i <= unixFormat.length-1; i++) {

      var arrElem = unixFormat[i]
      //console.log(arrElem, 'axis label')

      var dateElem = new Date(arrElem)
      

      var unixTimestamp = dateElem / 1000
      console.log(unixTimestamp)
      var api_url = url + unixTimestamp
      console.log(api_url)


        axios.get(api_url)
        .then(res => {
            var ob = res.data
            //timestampArr.push(ob)
            //var humanDate = moment(dateElem).format('L')
            pricesArr.push(ob[coin]['USD'])
            labelsArr.push(arrElem)
        })
      
    }
    
    let dataObj = { labels: unixFormat, 
      datasets: [
        {
          label: 'Price of ' + coin + ' from ' + plotTitle,
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: pricesArr
                }
              ]
            }
   
    this.setState({plotData: dataObj, boolz:!this.state.boolz, dateRange: unixFormat})

  }


  makePlot = () =>  {
  // onClick function for click for plot button 


    // get date 
    let nowDate = new Date();
    let nowMonth = (nowDate.getMonth() + 1).toString()
    let nowDay = nowDate.getDate().toString()
    let nowYear = nowDate.getYear().toString()

    

    // get prev 30 days 
    let queryDate = `${nowMonth} ${nowDay}`
    let unixFormat = this.getPrev30Days(queryDate, '2018')

    // plot data 
    let startDate = this.formatTitle(unixFormat, 'first')
    let endDate = this.formatTitle(unixFormat, 'last')
    let plotTitle = `${startDate} - ${endDate}`

    this.requestPlotData(unixFormat, plotTitle)

  }

  // for generating coin list in dropdown
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
      //console.log(coins_full_name)

      
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
    
    let cryptoSymbol = element.label.split(' ')
    let cryptoSymbolSplit = cryptoSymbol[cryptoSymbol.length-1].replace(')', '').replace('(', '')
    this.setState({initFromCurrency: element, inputValue: cryptoSymbolSplit  }); 

    // if you do element.label then list item chosen won't appear in text box... 
  }

  handleChangeToCurrency= (element) => {
    this.setState({initToCurrency: element});
    // if you do element.label then list item chosen won't appear in text box... 
  }

  update_amount_to_convert = (e) => {
    this.setState({moneyToConvert: e.target.value}, this.handleClick)
    //console.log(e.target.value)

     //this.setState({moneyToConvert: parseInt(e.target.value)},this.handleClick1);
  }

  handleClick = () => {

    let crypto = this.state.initFromCurrency.label.match(/\(([^)]+)\)/)[1]
    let cryptoSymbol = this.state.initFromCurrency.label.match(/\(([^)]+)\)/)[0].replace('(', '',).replace( ')', '')

    let curr = this.state.initToCurrency.label
    let amount = this.state.moneyToConvert
    //console.log(crypto, curr, amount )
    this.setState({showPriceBool: true})

    //'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR'
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=' + crypto + '&tsyms=' + curr 

    axios.get(url)
      .then(res => {
        let curr_to_dollars = res.data[curr] * parseInt(amount)
        console.log(res.data[curr])
        this.setState({
                      convertedPrice: curr_to_dollars.toLocaleString(), 
                      cryptoCurrentPrice: res.data[curr].toLocaleString()
                    })
      })
  }

  handleFlip = () => {
    this.setState({flipDropdown: !this.state.flipDropdown})
  }








  render() {

    const data= this.state.plotData

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






      <div className="content"> 

        <h4> <label > Enter an Amount <br />
          <input value={this.state.moneyToConvert} onChange={this.update_amount_to_convert} />
        </label> </h4>

        {!this.state.flipDropdown ? 

        <div className="wrapper"> 

          <div className="col"> 
            <FromCryptoCurrency options={coinlist}/>
          </div> 

          <div className="col">
            <button onClick={this.handleFlip} type="button" class="btn btn-default btn-sm">
            <span class="glyphicon glyphicon-transfer"></span>  
            </button>
          </div>

          <div className="col">
            <ToCurrency options={currencyList} />
          </div>

        </div> :

        <div className="wrapper">

          <div className="col"> 
            <ToCurrency options={currencyList} />
          </div> 

          <div className="col">
            <button onClick={this.handleFlip} type="button" class="btn btn-default btn-sm">
            <span class="glyphicon glyphicon-transfer"></span>  
            </button>
          </div> 

          <div className="col">
            <FromCryptoCurrency options={coinlist}/>
          </div>
        </div> 
        }



        <div> 
          <h4> {this.state.initFromCurrency.label} Current Price </h4>
          <label> {this.state.cryptoCurrentPrice} </label>

          <h4> Price in {this.state.initToCurrency.label} </h4>
          <label> {this.state.convertedPrice} </label>
        </div>

          


            {!this.state.boolz ? null: <div className="line-chart"> <Line data={data} /> </div>}

            <button onClick={this.makePlot} > Click for plot </button>



      </div>


    );
  }
}

export default App;
