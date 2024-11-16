import React, { Component } from "react";
import './Child1.css'
import * as d3 from "d3";

class Child1 extends Component {
  constructor(props) {
    super(props)

    this.state ={ 
        company: "Apple", // Default Company
        selectedMonth: 'November' //Default Month
      };
  }

  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate(prevProps) {
    if (this.props.csv_data !== prevProps.csv_data) {
        this.normalizeDates()
    }
    this.renderChart()
  }

  normalizeDates = () => {
    
  }

  handleChangeMonth = e => {
    this.setState({selectedMonth: e.target.value});
  }

  handleChangeCompany = e => {
    this.setState({company: e.target.value});
  }

  renderChart = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Use this data to create dropdown
    var monthInd = months.indexOf(this.state.selectedMonth);
    var filteredData = this.props.csv_data.filter(d => d.Company === this.state.company && d.Date.getMonth() === monthInd);
    console.log("filtered: ", filteredData)

    const margin = {left: 80, right: 80, top: 30, bottom: 40};
    const width = 750;
    const height = 450;

    var svg = d3.select(".my_svg").attr("width", width).attr("height", height);

    // Make legend
    var colors = { "Open": "#b2df8a", "Close": "#e41a1c" }
    var legend_g = svg.selectAll(".legend").data([0]).join("g").attr("transform", `translate(${width-margin.right+20})`).attr("class", "legend");
    var squareSize = 25;
    legend_g.selectAll("#open_square").data([0]).join("rect").attr("x", 0).attr("y", 0).attr("width", squareSize).attr("height", squareSize).attr("id", "open_square").attr("stroke", "None").attr("fill", colors["Open"]);
    legend_g.selectAll("#close_square").data([0]).join("rect").attr("x", 0).attr("y", squareSize+10).attr("width", squareSize).attr("height", squareSize).attr("id", "close_square").attr("stroke", "None").attr("fill", colors["Close"]);
    legend_g.selectAll("#open_text").data([0]).join("text").attr("x", squareSize+5).attr("y", Math.floor(squareSize/2)).attr("id", "open_text").text("Open").attr("dominant-baseline", "middle").attr("font-size", "12px");
    legend_g.selectAll("#close_text").data([0]).join("text").attr("x", squareSize+5).attr("y", Math.floor(1.5*squareSize) + 10).attr("id", "close_text").text("Close").attr("dominant-baseline", "middle").attr("font-size", "12px");

    // Add axes
    filteredData.forEach(item => {
        item.Date = new Date(item.Date);
    });

    var xScale = d3.scaleTime().domain([d3.min(filteredData, d => d.Date), d3.max(filteredData, d => d.Date)]).range([0, width - margin.left - margin.right]);
    var yScale = d3.scaleLinear().domain([Math.min(d3.min(filteredData, d => d.Close), d3.min(filteredData, d => d.Open)), Math.max(d3.max(filteredData, d => d.Close), d3.max(filteredData, d => d.Open))]).range([height - margin.top - margin.bottom, 0])

    svg.selectAll(".x_axis").data([0]).join("g").attr("class", "x_axis").attr("transform", `translate(${margin.left}, ${height - margin.bottom + 5})`).call(d3.axisBottom(xScale));
    svg.selectAll(".y_axis").data([0]).join("g").attr("class", "y_axis").attr("transform", `translate(${margin.left - 5}, ${margin.top})`).call(d3.axisLeft(yScale));

    //create tooltip window
    const tooltip = d3.select(".child1").selectAll(".tooltip")
      .data([0])
      .join("div")
      .attr("class", "tooltip")
      .style("opacity", 0); 

    // Add points
    var container = svg.selectAll(".graph").data([0]).join("g").attr("class", "graph").attr("transform", `translate(${margin.left}, ${margin.top})`);
    var openGraph = container.selectAll(".open_graph").data([0]).join("g").attr("class", "open_graph");
    var closeGraph = container.selectAll(".close_graph").data([0]).join("g").attr("class", "close_graph");

    openGraph.selectAll(".point").data(filteredData).join("circle").attr("class", "point").attr("fill", colors["Open"]).attr("r", 4).attr("cx", d => xScale(d.Date)).attr("cy", d => yScale(d.Open))
    .on("mouseover", (event, d) => {
        var date = d.Date;
        tooltip.html(`Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}<br>Open: ${d.Open}<br>Close: ${d.Close}<br>Difference: ${Math.round((d.Close-d.Open) * 100)/100}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px")
        .transition().duration(500).style("opacity", 0.75);
    })
    .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px")
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });
    closeGraph.selectAll(".point").data(filteredData).join("circle").attr("class", "point").attr("fill", colors["Close"]).attr("r", 4).attr("cx", d => xScale(d.Date)).attr("cy", d => yScale(d.Close))
    .on("mouseover", (event, d) => {
        var date = d.Date;
        tooltip.html(`Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}<br>Open: ${d.Open}<br>Close: ${d.Close}<br>Difference: ${Math.round((d.Close-d.Open) * 100)/100}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px")
        .transition().duration(500).style("opacity", 0.75);
    })
    .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px")
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });

    // Draw lines
    var lineGenOpen = d3.line().x(d => xScale(d.Date)).y(d => yScale(d.Open)).curve(d3.curveCardinal)
    var lineGenClose = d3.line().x(d => xScale(d.Date)).y(d => yScale(d.Close)).curve(d3.curveCardinal)

    openGraph.selectAll("path").data([0]).join("path").attr("d", lineGenOpen(filteredData)).attr("stroke", colors["Open"]).attr("fill", "None").attr("stroke-width", 3);
    closeGraph.selectAll("path").data([0]).join("path").attr("d", lineGenClose(filteredData)).attr("stroke", colors["Close"]).attr("fill", "None").attr("stroke-width", 3);
  }

  render() {
    const options = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta']; // Use this data to create radio button
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Use this data to create dropdown

    return (
      <div className="child1">
        <div id="inputs_div">
          <div className="radio_div">
            <label style={{ marginRight: '8px' }}>Company: </label>
            {
                options.map(d => <div className="company_radio_div"><input type="radio" className="company_radio_btn" onClick={this.handleChangeCompany} value={d} checked={d === this.state.company} /><label>{d}</label></div>)
            }
          </div>
          <div className="dropdown_div">
            <label>Month:</label>
            <select onChange={this.handleChangeMonth}>
                {
                    months.map(d => <option value={d} selected={d === this.state.selectedMonth}>{d}</option>)
                }
            </select>
          </div>
        </div>
          <div className="svg_div">
            <svg className="my_svg"></svg>
          </div>
      </div>
    );
  }
}

export default Child1;