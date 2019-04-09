import React, { Component } from 'react'
import * as d3 from 'd3'

class LineGraph extends Component {
  loadData() {
    fetch('http://localhost:5000/api')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }
  drawGraph() {
    const data = [12, 5, 8, 15, 3, 9]

    const svg = d3.select('svg').attr("width", 700).attr("height", 300)

    svg.selectAll("rect").data(data).enter().append("rect")
      .attr("x", (d, i) => i * 70)
      .attr("y", 0)
      .attr("width", 35)
      .attr("height", (d, i) => 300 - d * 10)
      .attr("fill", "blue")

  }
  componentDidMount() {
    this.loadData()
    this.drawGraph()
  }
  render() {
    return (
      <div>
        <h3>Line Graph</h3>
        <svg></svg>
      </div>
    )
  }
}

export default LineGraph