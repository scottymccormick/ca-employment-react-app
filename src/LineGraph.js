import React, { Component } from 'react'
import * as d3 from 'd3'
import { counties, industries } from './selectData'
import Dropdown from './Dropdown';

class LineGraph extends Component {
  constructor() {
    super()

    this.state = {
      industry: "Manufacturing",
      area: "Contra Costa County",
      test: "Test 1"
    }
  }
  loadData() {
    const urlString = `http://localhost:5000/api?area=${this.state.area}&industry=${this.state.industry}`
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
        employment: element.current_employment
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
    const testData = [
      "Test 1",
      "Test 2",
      "Test 3",
      "Test 4"
    ]
    return (
      <div>
        <label htmlFor="area-picker">Choose a County:</label>
        <select name="area" id="area-picker" defaultValue={this.state.area} 
          onChange={this.selectChange}>
          { counties.map((county) => {
            return (
              <option key={county} value={county}>{county}</option>
            )
          })}
        </select>
        <Dropdown name="test" id="test" label="Test Input" handleChange={this.selectChange} data={testData} />
        <Dropdown name="industry" id="industry-picker" label="Choose an Industry" handleChange={this.selectChange} data={industries} defaultValue={this.state.industry} />
        
        <h4>{this.state.industry} in {this.state.area}</h4>
        <svg version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    )
  }
}

export default LineGraph