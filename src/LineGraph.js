import React, { Component } from 'react'
import * as d3 from 'd3'
import { counties, industries, years } from './selectData'
import Dropdown from './Dropdown';

class LineGraph extends Component {
  constructor() {
    super()

    this.state = {
      industry: "Manufacturing",
      area: "Contra Costa County",
      startYear: 1990,
      endYear: 2017,
      showError: false
    }
  }
  loadData() {
    const urlString = `http://localhost:5000/api?area=${this.state.area}&industry=${this.state.industry}&startYear=${this.state.startYear}&endYear=${this.state.endYear}`
    fetch(urlString)
      .then(response => response.json())
      .then(data => this.parseData(data))
      .catch(error => console.log(error))
  }
  parseData(data) {
    const parsedArr = []
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const parsedElement = {
        date: new Date(element.date),
        employment: parseInt(element.current_employment)
      }
      parsedArr.push(parsedElement)
    }
    parsedArr.sort((a, b) => a.date - b.date)
    this.drawLine(parsedArr)
  }
  drawLine(arr) {
    var svgWidth = 600, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select('svg')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
      
    const g = svg.append("g")
      .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")"
      );

    let x = d3.scaleTime().rangeRound([0, width]);
    let y = d3.scaleLinear().rangeRound([height, 0]);
    
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.employment))
      x.domain(d3.extent(arr, d => d.date))
      y.domain(d3.extent(arr, d => d.employment))
    
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))      

    g.append("g").call(d3.axisLeft(y))

    g.append("path")
      .datum(arr)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }
  selectChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  dateChange = e => {
    if (e.target.name === 'startYear' && e.target.value > this.state.endYear) {
      e.target.value = this.state.endYear
      this.setState({
        startYear: this.state.endYear
      })
      this.displayError("The start year may not exceed the end year")
    } else if (e.target.name === 'endYear' && e.target.value < this.state.startYear) {      
      e.target.value = this.state.startYear
      this.setState({
        endYear: this.state.startYear
      })
      this.displayError("The end year may not exceed the start year")
    } else {
      this.setState({
        [e.target.name]: e.target.value,
        showError: false
      })
    }
  }
  displayError(message) {
    this.setState({
      showError: true,
      errorMessage: message
    })
    console.log(message)
  }
  componentDidMount() {
    this.loadData()
  }
  componentDidUpdate(prevState) {
    if (prevState.industry !== this.state.industry) {
      d3.select("svg").selectAll("g").remove()
      this.loadData()
    }
  }
  render() {
    return (
      <div>
        <section className="dropdown-pickers">
          <Dropdown name="area" id="area-picker" label="County" color="blue" handleChange={this.selectChange} data={counties} defaultValue={this.state.area} />
          <Dropdown name="industry" id="industry-picker" label="Industry" color="red" handleChange={this.selectChange} data={industries} defaultValue={this.state.industry} />
        </section>
        <section className="year-pickers">
          <Dropdown name="startYear" id="start-year-picker" label="From" handleChange={this.dateChange} data={years} defaultValue={this.state.startYear} />
          <Dropdown name="endYear" id="end-year-picker" label="To" handleChange={this.dateChange} data={years} defaultValue={this.state.endYear} />
        </section>
        <div className="message-area">
          {this.state.showError ?
          <span className="error-message">
            {this.state.errorMessage}
          </span> : null}
          </div>
        <h4>{this.state.industry} in {this.state.area} ({this.state.startYear === this.state.endYear ? 
            this.state.startYear :
            <span>
              {this.state.startYear} - {this.state.endYear}
            </span>
          })
          </h4>
        <svg version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    )
  }
}

export default LineGraph