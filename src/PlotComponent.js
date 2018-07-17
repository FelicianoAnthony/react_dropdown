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

  const monthNamesDict = {
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



class PlotComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      plotData: [],
      plotButtonBool: false,
      dateRange: []
     }
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

    let coin = this.props.inputValue
    console.log(coin, 'im in PlotComponent')
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
   
    this.setState({plotData: dataObj, plotButtonBool:!this.state.plotButtonBool, dateRange: unixFormat})

  }


  makePlot = () =>  {
  // onClick function for click for plot button 


    // get date 
    let nowDate = new Date();
    let nowMonth = (nowDate.getMonth() + 1).toString()
    let nowDay = nowDate.getDate().toString()
    let nowYear = nowDate.getFullYear().toString()

    

    // get prev 30 days 
    let queryDate = `${nowMonth} ${nowDay}`
    let unixFormat = this.getPrev30Days(queryDate, nowYear)

    // plot data 
    let startDate = this.formatTitle(unixFormat, 'first')
    let endDate = this.formatTitle(unixFormat, 'last')
    let plotTitle = `${startDate} - ${endDate}`

    this.requestPlotData(unixFormat, plotTitle)

  }

 





  render() {

    const data= this.state.plotData

 




    return (


      <div> 
        <button onClick={this.makePlot}> make plot! </button>
        {!this.state.plotButtonBool ? null: <div className="line-chart"> <Line data={data} /> </div>}
      </div>



    );
  }
}

export default PlotComponent;
