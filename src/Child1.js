import React, { Component } from "react";
import './Child1.css'
import * as d3 from "d3";

class Child1 extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if(this.props.csv_data.length !== 0) this.renderChart();
  }

  componentDidUpdate() {
    if(this.props.csv_data.length !== 0) this.renderChart();
  }

  renderChart = () => {
    var data = this.props.csv_data;

    var margin = {top: 25, bottom: 30, left: 30, right: 150}
    const width = 750;
    const height = 450;

    var svg = d3.selectAll(".my_svg").attr("width", width).attr("height", height)
    
    //create tooltip window
    var ttWidth = 300
    var ttHeight = 150
    const tooltip = d3.select(".streamgraph").selectAll(".tooltip")
      .data([0])
      .join("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    
    const tooltipSvg = tooltip.selectAll("svg").data([0]).join("svg")
    .attr("width", ttWidth).attr("height", ttHeight);

    var container = svg.selectAll(".graph").data([0]).join("g").attr("class", "graph").attr("transform", `translate(${margin.left}, ${margin.top})`);

    //keys from bottom to top
    var keys = ["LLaMA-3.1", "Claude", "PaLM-2", "Gemini", "GPT-4"]
    var stackGen = d3.stack().keys(keys).offset(d3.stackOffsetWiggle);
    
    //Create legend
    var colors = {"GPT-4": "#ff7f01", "Gemini": "#984ea3", "PaLM-2": "#4eaf4b", "Claude": "#367eb8", "LLaMA-3.1": "#e41a1c"};
    var legend_g = svg.selectAll(".legend").data([0]).join("g").attr("transform", `translate(${width-margin.right+15})`).attr("class", "legend");
    var squareSize = 24;

    var makeLegendLine = (key, sy) => {
      var f_key = key.replace(".", "")
      legend_g.selectAll(`#${f_key}_square`).data([0]).join("rect").attr("x", 0).attr("y", sy).attr("width", squareSize).attr("height", squareSize).attr("id", `${f_key}_square`).attr("stroke", "None").attr("fill", colors[key]);
      legend_g.selectAll(`#${f_key}_text`).data([0]).join("text").attr("x", squareSize+6).attr("y", sy + squareSize/2).attr("id", `${f_key}_text`).text(key).attr("dominant-baseline", "middle").attr("font-size", "12px");
    };

    var y_center = (height-margin.top-margin.bottom)/2 + margin.top;
    var mid_start = y_center - squareSize/2;
    makeLegendLine("GPT-4", mid_start-68)
    makeLegendLine("Gemini", mid_start-34)
    makeLegendLine("PaLM-2", mid_start)
    makeLegendLine("Claude", mid_start+34)
    makeLegendLine("LLaMA-3.1", mid_start+68)

    //make axes
    var xScale = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, width-margin.left-margin.right]);
    svg.selectAll(".x_axis").data([0]).join("g").attr("transform", `translate(${margin.left}, ${height-margin.bottom+10})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => {
        return d3.timeFormat("%b")(d);
      }));

    var stackedSeries = stackGen(data);

    var max = 0;
    var min = 0;
    stackedSeries.forEach(d => {
      var temp = d3.max(d, e => e[1]);
      if (temp > max) max = temp;
      temp = d3.min(d, e => e[0]);
      if (temp < min) min = temp;
    })
    var yScale = d3.scaleLinear().domain([min, max]).range([height-margin.top-margin.bottom, 0])

    //make graph
    
    var areaGen = d3.area().x(d => xScale(d.data.Date)).y0(d => yScale(d[0])).y1(d => yScale(d[1])).curve(d3.curveCardinal);
    container.selectAll(".g_path").data(stackedSeries).join("path").attr("class", "g_path").attr("d", d => areaGen(d)).attr("stroke", "None").attr("fill", d => colors[d.key])
    .on("mouseover", (event, d) => {
      tooltip.style("left", (event.pageX - ttWidth/2 - 5)+"px")
      .style("top", event.pageY + 5 + "px")
      .style("opacity", 1);
      console.log(d)
      var key = d.key;
      //make bar chart for key
      var ttmargin = {top: 10, left: 30, bottom: 30, right: 10}
      var ttgraph = tooltipSvg.selectAll(".ttgraph").data([null]).join("g").attr("class", "ttgraph").attr("transform", `translate(${ttmargin.left}, ${ttmargin.top})`)
      var ttScaleX = d3.scaleBand().domain(data.map(d => d.Date)).range([0, ttWidth-ttmargin.left-ttmargin.right]).padding(0.08);
      var ydata = data.map(d => d[key])
      var ttScaleY = d3.scaleLinear().domain([0, d3.max(ydata)]).range([ttHeight-ttmargin.top-ttmargin.bottom, 0])
      
      //joining axes
      tooltipSvg.selectAll(".tt_x_axis").data([0]).join("g").attr("class", "tt_x_axis").attr("transform", `translate(${ttmargin.left}, ${ttHeight - ttmargin.bottom})`).call(d3.axisBottom(ttScaleX).tickFormat((d) => {
        return d3.timeFormat("%b")(d);
      }));
      tooltipSvg.selectAll(".tt_y_axis").data([0]).join("g").attr("class", "tt_y_axis").attr("transform", `translate(${ttmargin.left}, ${ttmargin.top})`).call(d3.axisLeft(ttScaleY));

      //join bars
      var barData = data.map(d => [d.Date, d[key]])
      ttgraph.selectAll("rect").data(barData).join("rect").attr("x", d => ttScaleX(d[0])).attr("y", d => ttScaleY(d[1])).attr("width", ttScaleX.bandwidth()).attr("height", d => ttHeight-ttmargin.top-ttmargin.bottom-ttScaleY(d[1])).attr("stroke", "None").attr("fill", colors[key]);
    })
    .on("mousemove", (event, d) => {
      tooltip.style("left", (event.pageX - ttWidth/2 - 5)+"px")
      .style("top", event.pageY + 5 + "px");
    })
    .on("mouseout", (event, d) => {
      tooltip.style("opacity", 0);
    })
  }

  render() {
    return (
      <div className="streamgraph">
            <svg className="my_svg"></svg>
      </div>
    );
  }
}

export default Child1;